import type { CheckedState } from "@radix-ui/react-checkbox";
import type { ClassValue } from "clsx";
import { getAllEnumValues } from "enum-for";
import type { ChangeEvent, PropsWithChildren } from "react";
import { useCallback, useId, useMemo } from "react";
import { cn } from "~/lib/utils";
import { Checkbox } from "../ui/checkbox";
import type { InputProps } from "../ui/input";
import { Input } from "../ui/input";
import { LabelPosition, LabeledElement } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import type { Form } from "./context";
import { useValueByName } from "./context";

export type FieldProps = {
	readonly form: Form<any>;
	readonly label: string;
	readonly name: string;
};

function ErrorContainer({
	error,
	errorId,
	className,
	children,
}: PropsWithChildren<{
	readonly className?: ClassValue;
	readonly error: Error | null | undefined;
	readonly errorId: string;
}>) {
	return (
		<div className={cn("flex flex-col", className)}>
			{children}
			{error == null ? null : (
				<span className="text-red-500 text-sm" id={errorId}>
					{error.message}
				</span>
			)}
		</div>
	);
}

export type TextInputFieldProps = FieldProps & Omit<InputProps, "form">;

export function TextInputField({
	form,
	label,
	name,
	className,
	...props
}: TextInputFieldProps) {
	const [data, setData] = useValueByName<any, number | string>(form, name);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			event.stopPropagation();
			setData(event.target.value);
		},
		[setData],
	);

	return (
		<LabeledElement className={className} label={label}>
			<Input
				{...props}
				name={name}
				onChange={handleChange}
				value={data ?? ""}
			/>
		</LabeledElement>
	);
}

export type SelectFieldProps = FieldProps & { readonly options: any };

export function SelectField({ form, label, name, options }: SelectFieldProps) {
	const [data, setData] = useValueByName<any, string>(form, name);

	const handleChange = useCallback(
		(newValue: string) => {
			setData(newValue);
		},
		[setData],
	);

	return (
		<LabeledElement className="w-64" label={label}>
			<Select onValueChange={handleChange} value={data?.toString()}>
				<SelectTrigger>
					<SelectValue placeholder={label} />
				</SelectTrigger>
				<SelectContent>
					{getAllEnumValues(options).map((type) => (
						<SelectItem key={type} value={type.toString()}>
							{options[type]}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</LabeledElement>
	);
}

export function CheckboxField({ label, name, form }: FieldProps) {
	const [value, setValue] = useValueByName<any, boolean>(form, name);

	const handleCheckedChange = useCallback(
		(checked: CheckedState) => {
			if (checked === true) {
				setValue(true);
			} else {
				setValue(false);
			}
		},
		[setValue],
	);

	return (
		<LabeledElement className="flex items-center gap-2" label={label}>
			<Checkbox checked={value} onCheckedChange={handleCheckedChange} />
		</LabeledElement>
	);
}

export type CheckboxFieldListProps = Omit<FieldProps, "label"> & {
	readonly options: any;
};

export function CheckboxFieldList({
	form,
	name,
	options,
}: CheckboxFieldListProps) {
	const enumValues = useMemo(
		() => [...new Set(getAllEnumValues(options))],
		[options],
	);
	const [values, setValues] = useValueByName<any, number[] | undefined>(
		form,
		name,
	);

	return (
		<fieldset className="grid grid-flow-dense grid-cols-3 gap-2">
			{enumValues.map((option) => (
				<LabeledElement
					className="flex items-center gap-2"
					key={option}
					label={options[option]}
					position={LabelPosition.Before}
				>
					<Checkbox
						checked={values?.includes(option)}
						name={`${name}[${option}]`}
						// onBlur={field.handleBlur}
						onCheckedChange={(checked) => {
							if (checked === true) {
								setValues([...(values ?? []), option]);
							} else if (checked === false) {
								setValues(values?.filter((value) => value !== option));
							}
						}}
					/>
				</LabeledElement>
			))}
		</fieldset>
	);
}

export default function TextareaField({ label, name, form }: FieldProps) {
	const [value, setValue] = useValueByName<any, string>(form, name);
	const errorId = useId();

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLTextAreaElement>) => {
			setValue(event.target.value);
		},
		[setValue],
	);

	return (
		<LabeledElement label={label}>
			<Textarea
				aria-errormessage={errorId}
				name={name}
				onChange={handleChange}
				value={value}
			/>
		</LabeledElement>
	);
}
