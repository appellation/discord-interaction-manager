import { type PropsWithChildren, Suspense, lazy } from "react";

import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const LoginForm = lazy(() => import("./LoginForm"));

export function LoginDialog({
	children,
	asChild,
	open,
	onOpenChange,
}: PropsWithChildren<{
	readonly asChild?: boolean;
	onOpenChange?(open: boolean): void;
	readonly open?: boolean;
}>) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild={asChild}>{children}</DialogTrigger>
			<DialogContent>
				<Suspense>
					<LoginForm onSuccess={() => onOpenChange?.(false)} />
				</Suspense>
			</DialogContent>
		</Dialog>
	);
}
