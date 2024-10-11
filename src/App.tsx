import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import LoginMenu from "./components/LoginMenu";
import { Heading } from "./components/ui/typography";

const HomePage = lazy(async () => import("./pages/Home"));
const EditCommandPage = lazy(() => import("./pages/commands/Edit"));

function App() {
	return (
		<>
			<Heading level={1}>Discord Interactions</Heading>
			<LoginMenu />
			<Suspense>
				<Switch>
					<Route path="/" component={HomePage} />
					<Route path="/commands/:commandId/edit" component={EditCommandPage} />
				</Switch>
			</Suspense>
		</>
	);
}

export default App;
