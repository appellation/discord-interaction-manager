import { Link } from "wouter";
import { useFetchUser } from "~/lib/fetch";
import { useCurrentApp } from "~/lib/state";
import { Button } from "./ui/button";

export default function LoginMenu() {
	const [currentApp] = useCurrentApp();
	const { data: currentAppAuth } = useFetchUser(currentApp);

	return (
		<Button asChild variant="outline">
			<Link to="/apps">{currentAppAuth?.application.name ?? "Login"}</Link>
		</Button>
	);
}
