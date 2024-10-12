import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type { FieldApi } from "@tanstack/react-form";
import { getAllEnumValues } from "enum-for";
import { Check } from "lucide-react";
import * as React from "react";
import { cn } from "~/lib/utils";
import { Label, LabelPosition, LabeledElement } from "./label";
import { Heading } from "./typography";

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
	<CheckboxPrimitive.Root
		className={cn(
			"peer h-4 w-4 shrink-0 rounded-sm border border-slate-200 border-slate-900 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50 dark:border-slate-800 dark:border-slate-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 dark:data-[state=checked]:bg-slate-50 dark:data-[state=checked]:text-slate-900",
			className,
		)}
		ref={ref}
		{...props}
	>
		<CheckboxPrimitive.Indicator
			className={cn("flex items-center justify-center text-current")}
		>
			<Check className="h-4 w-4" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export type CheckboxFieldProps = Omit<
	React.ComponentProps<typeof CheckboxPrimitive.Root>,
	"checked" | "name" | "onBlur" | "onCheckedChange"
> & {
	readonly field: FieldApi<any, any>;
	readonly label: string;
};

const CheckboxField = ({ label, field, ...props }: CheckboxFieldProps) => {
	const id = React.useId();

	return (
		<div className="flex items-center gap-2">
			<Label htmlFor={id}>{label}</Label>
			<Checkbox
				{...props}
				checked={field.state.value}
				id={id}
				name={field.name}
				onBlur={field.handleBlur}
				onCheckedChange={(event) => event != null && field.handleChange(event)}
			/>
		</div>
	);
};

export type CheckboxFieldListProps = {
	readonly field: FieldApi<any, any>;
	readonly label: string;
	readonly options: any;
};

const CheckboxFieldList = ({
	label,
	field,
	options,
}: CheckboxFieldListProps) => {
	// some dapi enums have duplicate values
	const enumValues = [...new Set(getAllEnumValues(options))];

	return (
		<>
			<Heading level={3}>{label}</Heading>
			<fieldset className="grid grid-flow-dense grid-cols-3 gap-2">
				{enumValues.map((option) => {
					const index = field.state.value?.indexOf(option) ?? -1;
					return (
						<div className="flex items-center gap-2" key={option}>
							<LabeledElement
								label={options[option]}
								position={LabelPosition.Before}
							>
								<Checkbox
									checked={index >= 0}
									name={field.name}
									onBlur={field.handleBlur}
									onCheckedChange={(checked) => {
										if (checked === true) {
											field.pushValue(option);
										} else if (checked === false) {
											void field.removeValue(index);
										}
									}}
								/>
							</LabeledElement>
						</div>
					);
				})}
			</fieldset>
		</>
	);
};

export { Checkbox, CheckboxField, CheckboxFieldList };
