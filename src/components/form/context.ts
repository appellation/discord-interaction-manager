import type { Draft } from "immer";
import { atom, getDefaultStore, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { get, set } from "lodash";
import type { FormEvent, FormEventHandler } from "react";
import { useCallback, useMemo } from "react";
import { reach, type Schema } from "yup";

export type Form<T> = {
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

	const handleSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const data = getDefaultStore().get(state);
			try {
				const validated = validator.validateSync(data);
				onSubmit(validated);
			} catch {
				// validation happens in each component
			}
		},
		[state, onSubmit, validator],
	);

	return useMemo(
		() => ({ state, validator, handleSubmit }),
		[state, validator, handleSubmit],
	);
}

function useGetValueByName<T, U>(name: string): (value: T) => U {
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

export function useValue<T, U>(
	{ state }: Form<T>,
	getValue: (object: T) => U,
	setValue: (draft: Draft<T>, value: U) => void,
) {
	const value = useMemo(
		() =>
			atom(
				(get) => getValue(get(state)),
				(get, set, value: U) => set(state, (draft) => setValue(draft, value)),
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
