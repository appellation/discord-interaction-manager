import { useLocalStorage } from "@uidotdev/usehooks";

type ApplicationInfo = {
	secret: string;
	token?: string;
};

export function setApplicationInfo(id: string, info: ApplicationInfo) {
	const item = localStorage.getItem("application_info");
	const existing = item ? JSON.parse(item) : {};
	existing[id] = info;
	localStorage.setItem("application_info", JSON.stringify(existing));
}

export function useApplicationInfo() {
	return useLocalStorage<Record<string, ApplicationInfo> | null>(
		"application_info",
		null,
	);
}

export function setCurrentApp(id: string) {
	localStorage.setItem("current_application", id);
}

export function useCurrentApp() {
	return useLocalStorage<string | null>("current_application", null);
}

export function useCurrentAppInfo() {
	const [appInfo] = useApplicationInfo();
	const [currentApp] = useCurrentApp();

	return currentApp ? appInfo?.[currentApp] : null;
}
