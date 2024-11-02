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
	const handleInteractOutside = useCallback(
		(
			event:
				| CustomEvent<{ originalEvent: FocusEvent }>
				| CustomEvent<{ originalEvent: PointerEvent }>,
		) => {
			const el = event.target as HTMLElement;
			const is1Pass = el.localName.startsWith("com-1password");
			if (is1Pass) {
				event.preventDefault();
			}
		},
		[],
	);

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			<DialogTrigger asChild={asChild}>{children}</DialogTrigger>
			<DialogContent onInteractOutside={handleInteractOutside}>
				<Suspense>
					<LoginForm onSuccess={() => handleOpenChange(false)} />
				</Suspense>
			</DialogContent>
		</Dialog>
	);
}
