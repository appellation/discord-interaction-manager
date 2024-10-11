import type { ReadonlySignal } from "@preact/signals-react";
import type { FieldApi, Updater } from "@tanstack/react-form";
import type { FocusEventHandler } from "react";
import { forwardRef, useId } from "react";
import type { InputProps } from "./input";
import { Input } from "./input";
import { Label } from "./label";

type TextInputProps = InputProps & {
	readonly error?: ReadonlySignal<string>;
	readonly label?: string;
	readonly name: string;
	readonly onBlur: FocusEventHandler<HTMLInputElement>;
	readonly onChange: Updater<string, void>;
	readonly placeholder?: string;
	readonly required?: boolean;
	readonly type: "date" | "email" | "password" | "tel" | "text" | "url";
	readonly value?: string;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	({ label, value, error, onChange, ...props }, ref) => {
		const { required } = props;
		const id = useId();
		return (
			<div>
				{label && (
					<Label htmlFor={id}>
						{label} {required && <span>*</span>}
					</Label>
				)}
				<Input
					{...props}
					aria-errormessage={`${id}-error`}
					aria-invalid={Boolean(error?.value)}
					id={id}
					onChange={(event) => onChange?.(event.target.value)}
					ref={ref}
					value={value ?? ""}
				/>
				{error?.value && <div id={`${id}-error`}>{error}</div>}
			</div>
		);
	},
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
