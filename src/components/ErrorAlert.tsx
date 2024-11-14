import { AlertTriangleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export default function ErrorAlert({
	error,
	className,
}: {
	readonly className?: string;
	readonly error?: Error | null;
}) {
	return (
		error && (
			<Alert className={className} variant="destructive">
				<AlertTriangleIcon className="w-4 h-4" />
				<AlertTitle>Error!</AlertTitle>
				<AlertDescription className="ws-pre-line">
					{error.message}
				</AlertDescription>
			</Alert>
		)
	);
}
