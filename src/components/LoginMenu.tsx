import { Link } from "wouter";
import { useFetchCurrentApp } from "~/lib/fetch";
import { useApps } from "~/lib/state";
import { LoginDialog } from "./LoginDialog";
import type { ButtonProps } from "./ui/button";
import { Button } from "./ui/button";

export default function LoginMenu(props: ButtonProps) {
	const { data: currentAppAuth } = useFetchCurrentApp();
	const [apps] = useApps();

	if (currentAppAuth == null && Object.keys(apps ?? {}).length === 0) {
		return (
			<LoginDialog asChild>
				<Button>Login</Button>
			</LoginDialog>
		);
	}

	return (
		<Button variant="outline" {...props} asChild>
			<Link to="/apps">{currentAppAuth?.application.name ?? "Login"}</Link>
		</Button>
	);
}
