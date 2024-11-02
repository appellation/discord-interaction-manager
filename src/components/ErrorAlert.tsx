import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function ErrorAlert({
	error,
}: {
	readonly error?: Error | null;
}) {
	return (
		error && (
			<Alert variant="destructive">
				<AlertTriangleIcon className="w-4 h-4" />
				<AlertTitle>Error!</AlertTitle>
				<AlertDescription>{error.message}</AlertDescription>
			</Alert>
		)
	);
}
