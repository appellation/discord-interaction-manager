import type { ReadonlySignal } from "@preact/signals-react";
import type { FieldApi, Updater } from "@tanstack/react-form";
import { forwardRef } from "react";
import type { InputProps } from "./input";
import { Input } from "./input";
import { LabeledElement } from "./label";

type TextInputProps = InputProps & {
	readonly className?: string;
	readonly error?: ReadonlySignal<string>;
	readonly label: string;
	readonly onChange: Updater<string, void>;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	({ label, value, error, onChange, className, ...props }, ref) => (
		<LabeledElement className={className} label={label}>
			<Input
				{...props}
				onChange={(event) => onChange?.(event.target.value)}
				ref={ref}
				value={value ?? ""}
			/>
		</LabeledElement>
	),
);

export type TextInputFieldProps = Omit<
	TextInputProps,
	"name" | "onBlur" | "onChange" | "value"
> & {
	readonly field: FieldApi<any, any, any, any, any>;
};

export const TextInputField = forwardRef<HTMLInputElement, TextInputFieldProps>(
	({ field, ...rest }, ref) => (
		<TextInput
			name={field.name}
			onBlur={field.handleBlur}
			onChange={field.handleChange}
			ref={ref}
			value={field.state.value}
			{...rest}
		/>
	),
);
