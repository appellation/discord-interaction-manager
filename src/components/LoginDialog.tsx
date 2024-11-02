import {
	type PropsWithChildren,
	Suspense,
	lazy,
	useState,
	useCallback,
} from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

const LoginForm = lazy(async () => import("./LoginForm"));

export function LoginDialog({
	children,
	asChild,
}: PropsWithChildren<{
	readonly asChild?: boolean;
}>) {
	const [open, setOpen] = useState(false);
	const handleOpenChange = useCallback(
		(newOpen: boolean) => setOpen(newOpen),
		[],
	);

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			<DialogTrigger asChild={asChild}>{children}</DialogTrigger>
			<DialogContent>
				<Suspense>
					<LoginForm onSuccess={() => handleOpenChange(false)} />
				</Suspense>
			</DialogContent>
		</Dialog>
	);
}
