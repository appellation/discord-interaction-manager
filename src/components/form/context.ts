import type { PrimitiveAtom } from "jotai";
import { atom, getDefaultStore, useAtom } from "jotai";
import { cloneDeep, get, set } from "lodash";
import type { FormEvent, FormEventHandler } from "react";
import { useCallback, useMemo } from "react";
import { reach, type Schema } from "yup";

export type Form<T> = {
	handleSubmit: FormEventHandler;
	state: PrimitiveAtom<T>;
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
	const state = useMemo(() => atom(data), [data]);

	const handleSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const data = getDefaultStore().get(state);
			try {
				const validated = validator.validateSync(data);
				console.log(validated);
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
): (object: T, value: U) => T {
	return useCallback((object, value) => set(object, name, value), [name]);
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
	setValue: (object: T, value: U) => T,
) {
	const value = useMemo(
		() =>
			atom(
				(get) => getValue(get(state)),
				(get, set, value: U) =>
					// TODO: remove this cloneDeep (immer?)
					set(state, (object) => cloneDeep(setValue(object, value))),
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
