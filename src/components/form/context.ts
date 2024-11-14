import type { Draft } from "immer";
import { atom, getDefaultStore, useAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { get, set } from "lodash";
import type { FormEvent, FormEventHandler } from "react";
import { useCallback, useMemo, useState } from "react";

export type Form<T> = {
	handleSubmit: FormEventHandler;
	state: ReturnType<typeof atomWithImmer<T>>;
};

export type FormOptions<T> = {
	readonly data: T;
	onSubmit(this: void, data: T): void;
};

export function useForm<T>({ data, onSubmit }: FormOptions<T>): Form<T> {
	const state = useMemo(() => atomWithImmer(data), [data]);

	const handleSubmit = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();

			const data = getDefaultStore().get(state);
			onSubmit(data);
		},
		[state, onSubmit],
	);

	return useMemo(() => ({ state, handleSubmit }), [state, handleSubmit]);
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
