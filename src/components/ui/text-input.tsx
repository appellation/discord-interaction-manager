import type { ReadonlySignal } from "@preact/signals-react";
import type { ChangeEventHandler, FocusEventHandler } from "react";
import { forwardRef } from "react";
import { Input } from "./input";
import { Label } from "./label";

type TextInputProps = {
	readonly error?: ReadonlySignal<string>;
	readonly label?: string;
	readonly name: string;
	readonly onBlur: FocusEventHandler<HTMLInputElement>;
	readonly onChange: ChangeEventHandler<HTMLInputElement>;
	readonly placeholder?: string;
	readonly required?: boolean;
	readonly type: "date" | "email" | "password" | "tel" | "text" | "url";
	readonly value?: ReadonlySignal<string | undefined>;
};

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
	({ label, value, error, ...props }, ref) => {
		const { name, required } = props;
		return (
			<div>
				{label && (
					<Label htmlFor={name}>
						{label} {required && <span>*</span>}
					</Label>
				)}
				<Input
					{...props}
					ref={ref}
					id={name}
					value={value?.value ?? ""}
					aria-invalid={Boolean(error?.value)}
					aria-errormessage={`${name}-error`}
				/>
				{error?.value && <div id={`${name}-error`}>{error}</div>}
			</div>
		);
	},
);
