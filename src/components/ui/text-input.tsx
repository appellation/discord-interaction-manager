import type { ReadonlySignal } from "@preact/signals-react";
import type { FocusEventHandler } from "react";
import { forwardRef, useId } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { Updater } from "@tanstack/react-form";

type TextInputProps = {
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
					onChange={(e) => onChange?.(e.target.value)}
					ref={ref}
					id={id}
					value={value ?? ""}
					aria-invalid={Boolean(error?.value)}
					aria-errormessage={`${id}-error`}
				/>
				{error?.value && <div id={`${id}-error`}>{error}</div>}
			</div>
		);
	},
);
