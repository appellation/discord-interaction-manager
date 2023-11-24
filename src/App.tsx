import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import { LoginDialog } from "./components/LoginDialog";
import { Dialog, DialogTrigger } from "./components/ui/dialog";

const HomePage = lazy(async () => import("./pages/Home"));

function App() {
	return (
		<>
			<Heading level={1}>Discord Interactions</Heading>
			<Dialog>
				<DialogTrigger asChild>
					<Button type="button">Login</Button>
				</DialogTrigger>
				<LoginDialog />
			</Dialog>
			<Suspense>
				<Switch>
					<Route path="/" component={HomePage} />
				</Switch>
			</Suspense>
		</>
	);
}

export default App;
