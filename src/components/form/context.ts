import type { Draft } from "immer";
import { atom, getDefaultStore, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { get, set } from "lodash";
import type { FormEvent, FormEventHandler } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { reach, type Schema } from "yup";

export type Form<T> = {
	error?: Error;
	events: EventTarget;
	handleSubmit: FormEventHandler;
	state: ReturnType<typeof atomWithImmer<T>>;
	validator: Schema;
};

export type FormOptions<T> = {
	readonly data: T;
	onSubmit(this: void, data: T): void;
	readonly validator: Schema;
};

export function useForm<T>({
	data,
	validator,
	onSubmit,
}: FormOptions<T>): Form<T> {
	const state = useMemo(() => atomWithImmer(data), [data]);
	const [error, setError] = useState<Error>();
	const events = useRef(new EventTarget());

	const handleSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const data = getDefaultStore().get(state);
			try {
				events.current.dispatchEvent(new Event("validate"));
				const validated = validator.validateSync(data, { abortEarly: false });
				onSubmit(validated);
				setError(undefined);
			} catch (error) {
				setError(error as Error);
			}
		},
		[state, onSubmit, validator],
	);

	return useMemo(
		() => ({ state, validator, handleSubmit, error, events: events.current }),
		[state, validator, handleSubmit, error],
	);
}

function useGetValueByName<T, U>(name: string): (value: Draft<T> | T) => U {
	return useCallback((object) => get(object, name), [name]);
}

function useSetValueByName<T extends object, U>(
	name: string,
): (draft: Draft<T>, value: U) => void {
	return useCallback(
		(draft, value) => {
			set(draft, name, value);
		},
		[name],
	);
}

export function useValueByName<T extends object, U>(
	form: Form<T>,
	name: string,
) {
	const getValue = useGetValueByName<T, U>(name);
	const setValue = useSetValueByName<T, U>(name);
	return useValue(form, getValue, setValue);
}

type NotFunction<T> = Exclude<T, Function>;

export function useValue<T, U>(
	{ state }: Form<T>,
	getValue: (object: Draft<T> | T) => U,
	setValue: (draft: Draft<T>, value: U) => void,
) {
	const value = useMemo(
		() =>
			atom(
				(get) => getValue(get(state)),
				(get, set, value: NotFunction<U> | ((draft: Draft<U>) => U)) => {
					set(state, (draft) => {
						if (typeof value === "function") {
							// @ts-expect-error typescript is stupid
							setValue(draft, value(getValue(draft)));
						} else {
							setValue(draft, value);
						}
					});
				},
			),
		[state, getValue, setValue],
	);
	return useAtom(value);
}

export function useValidatorByName(
	{ validator }: Form<any>,
	name: string,
): Schema {
	return useMemo(() => reach(validator, name), [validator, name]) as Schema;
}

export function useValidateByName(form: Form<any>, name: string) {
	const validator = useValidatorByName(form, name);
	const [error, setError] = useState<Error>();

	const validate = useCallback(
		(value: any) => {
			try {
				validator.validateSync(value, { abortEarly: false });
				setError(undefined);
			} catch (error) {
				setError(error as Error);
			}
		},
		[validator],
	);

	const cast = useCallback((value: any) => validator.cast(value), [validator]);

	useEffect(() => {
		const callback = () => {
			const data = get(getDefaultStore().get(form.state), name);
			validate(data);
		};

		form.events.addEventListener("validate", callback);
		return () => form.events.removeEventListener("validate", callback);
	}, [validate, name, form.state, form.events]);

	return useMemo(() => ({ error, validate, cast }), [error, validate, cast]);
}
