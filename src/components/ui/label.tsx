import * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/lib/utils";

const labelVariants = cva(
	"text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
);

const Label = React.forwardRef<
	React.ElementRef<typeof LabelPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
		VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
	<LabelPrimitive.Root
		className={cn(labelVariants(), className)}
		ref={ref}
		{...props}
	/>
));
Label.displayName = LabelPrimitive.Root.displayName;

export enum LabelPosition {
	After = "after",
	Before = "before",
}

function LabeledElement({
	label,
	position = LabelPosition.After,
	className,
	children,
}: React.PropsWithChildren<{
	readonly className?: string;
	readonly label: string;
	readonly position?: LabelPosition;
}>) {
	const id = React.useId();
	const content = <Slot id={id}>{children}</Slot>;

	return (
		<div className={className}>
			{position === LabelPosition.Before && content}
			<Label htmlFor={id}>{label}</Label>
			{position === LabelPosition.After && content}
		</div>
	);
}

export { Label, LabeledElement };
