import { Suspense, lazy } from "react";
import { Route, Switch } from "wouter";

const HomePage = lazy(async () => import("./pages/Home"));
const AppsPage = lazy(async () => import("./pages/Apps"));
const AddCommandPage = lazy(async () => import("./pages/commands/Add"));
const EditCommandPage = lazy(async () => import("./pages/commands/Edit"));

export default function Routes() {
	return (
		<Suspense>
			<Switch>
				<Route component={HomePage} path="/" />
				<Route component={AppsPage} path="/apps" />
				<Route component={AddCommandPage} path="/commands/add" />
				<Route component={EditCommandPage} path="/commands/:commandId/edit" />
			</Switch>
		</Suspense>
	);
}
