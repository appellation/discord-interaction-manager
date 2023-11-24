import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

const headingVariants = cva("scroll-m-20 tracking-tight", {
	variants: {
		level: {
			1: "text-4xl font-extrabold lg:text-5xl",
			2: "border-b pb-2 text-3xl font-semibold first:mt-0",
			3: "text-2xl font-semibold",
			4: "text-xl font-semibold",
		},
	},
});

export type HeadingProps = React.HTMLAttributes<HTMLHeadingElement> &
	VariantProps<typeof headingVariants>;

export function Heading({
	level,
	children,
	className,
	...props
}: PropsWithChildren<HeadingProps>) {
	const Comp = `h${level ?? 1}` as const;
	return (
		<Comp {...props} className={cn(headingVariants({ level, className }))}>
			{children}
		</Comp>
	);
}
