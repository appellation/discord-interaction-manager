import { Trash2Icon } from "lucide-react";
import { type ComponentProps, type PropsWithChildren } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

export default function DeleteConfirmButton({
	onClick,
	...props
}: Omit<ComponentProps<typeof Button>, "children" | "variant">) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button {...props} aria-label="Delete" variant="destructive">
					<Trash2Icon className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Danger!</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					Are you sure you want to delete this?
				</DialogDescription>
				<DialogFooter>
					<DialogClose asChild>
						<Button variant="secondary">No</Button>
					</DialogClose>
					<DialogClose asChild onClick={onClick}>
						<Button variant="destructive">Yes</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
