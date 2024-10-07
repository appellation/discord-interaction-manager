import { useLocalStorage } from "@uidotdev/usehooks";

export type ApplicationInfo = {
	secret: string;
	token?: string;
};

export function getApps(): Record<string, ApplicationInfo> {
	const apps = localStorage.getItem("application_info");
	return apps ? JSON.parse(apps) : {};
}

export function useApps() {
	return useLocalStorage<Record<string, ApplicationInfo> | null>(
		"application_info",
		null,
	);
}

export function useCurrentApp() {
	return useLocalStorage<string | null>("current_application", null);
}

export function useCurrentAppInfo() {
	const [appInfo] = useApps();
	const [currentApp] = useCurrentApp();

	return currentApp ? appInfo?.[currentApp] : null;
}
