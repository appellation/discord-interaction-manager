import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";

const HomePage = lazy(async () => import("./pages/Home"));

function App() {
	return (
		<>
			<h1>Discord Interactions</h1>
			<Suspense>
				<Switch>
					<Route path="/" component={HomePage} />
				</Switch>
			</Suspense>
		</>
	);
}

export default App;
