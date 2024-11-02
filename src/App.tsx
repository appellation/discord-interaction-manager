import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import LoginMenu from "./components/LoginMenu";
import { Heading } from "./components/ui/typography";

const HomePage = lazy(async () => import("./pages/Home"));
const AppsPage = lazy(async () => import("./pages/Apps"));
const EditCommandPage = lazy(async () => import("./pages/commands/Edit"));

function App() {
	return (
		<>
			<div className="flex items-baseline">
				<Heading className="grow" level={1}>
					Discord Interactions
				</Heading>
				<LoginMenu />
			</div>
			<Suspense>
				<Switch>
					<Route component={HomePage} path="/" />
					<Route component={AppsPage} path="/apps" />
					<Route component={EditCommandPage} path="/commands/:commandId/edit" />
				</Switch>
			</Suspense>
		</>
	);
}

export default App;
