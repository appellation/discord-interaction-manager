import type { FieldApi } from "@tanstack/react-form";
import * as React from "react";
import { cn } from "~/lib/utils";
import { Label } from "./label";

export type TextareaProps =
	React.TextareaHTMLAttributes<HTMLTextAreaElement> & {};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, ...props }, ref) => (
		<textarea
			className={cn(
				"flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
				className,
			)}
			ref={ref}
			{...props}
		/>
	),
);
Textarea.displayName = "Textarea";

export type TextareaFieldProps = TextareaProps & {
	readonly field: FieldApi<any, any, any, any, any>;
	readonly label?: string;
};

const TextareaField = ({ label, field, ...props }: TextareaFieldProps) => {
	const id = React.useId();

	return (
		<>
			<Label htmlFor={id}>{label}</Label>
			<Textarea
				{...props}
				id={id}
				name={field.name}
				onBlur={field.handleBlur}
				onChange={(error) => field.handleChange(error.target.value)}
				value={field.state.value}
			/>
		</>
	);
};

export { Textarea, TextareaField };
