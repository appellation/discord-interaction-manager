import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import LoginMenu from "./components/LoginMenu";
import { Heading } from "./components/ui/typography";

const HomePage = lazy(async () => import("./pages/Home"));
const EditCommandPage = lazy(async () => import("./pages/commands/Edit"));

function App() {
	return (
		<>
			<Heading level={1}>Discord Interactions</Heading>
			<LoginMenu />
			<Suspense>
				<Switch>
					<Route component={HomePage} path="/" />
					<Route component={EditCommandPage} path="/commands/:commandId/edit" />
				</Switch>
			</Suspense>
		</>
	);
}

export default App;
