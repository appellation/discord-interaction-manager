import { useLocalStorage } from "@uidotdev/usehooks";

export type ApplicationInfo = {
	secret: string;
	token?: string;
};

export function getApplications(): Record<string, ApplicationInfo> {
	const item = localStorage.getItem("application_info");
	return item ? JSON.parse(item) : {};
}

export function setApp(id: string, info: ApplicationInfo) {
	const existing = getApplications();
	existing[id] = info;
	localStorage.setItem("application_info", JSON.stringify(existing));
}

export function useApps() {
	return useLocalStorage<Record<string, ApplicationInfo> | null>(
		"application_info",
		null,
	);
}

export function getCurrentApp(): string | null {
	const item = localStorage.getItem("current_application");
	return item ? JSON.parse(item) : null;
}

export function setCurrentApp(id: string) {
	localStorage.setItem("current_application", JSON.stringify(id));
}

export function useCurrentApp() {
	return useLocalStorage<string | null>("current_application", null);
}

export function useCurrentAppInfo() {
	const [appInfo] = useApps();
	const [currentApp] = useCurrentApp();

	return currentApp ? appInfo?.[currentApp] : null;
}
