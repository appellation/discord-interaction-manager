import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	// eslint-disable-next-line react/prop-types
	({ className, type, ...props }, ref) => (
		<input
			className={cn(
				"flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300",
				className,
			)}
			ref={ref}
			type={type}
			{...props}
		/>
	),
);
Input.displayName = "Input";

export { Input };
