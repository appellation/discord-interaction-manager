import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";
import LoginMenu from "./components/LoginMenu";
import { Heading } from "./components/ui/typography";

const HomePage = lazy(async () => import("./pages/Home"));

function App() {
	return (
		<>
			<Heading level={1}>Discord Interactions</Heading>
			<LoginMenu />
			<Suspense>
				<Switch>
					<Route path="/" component={HomePage} />
				</Switch>
			</Suspense>
		</>
	);
}

export default App;
