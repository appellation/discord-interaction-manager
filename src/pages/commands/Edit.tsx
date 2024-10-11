import { CheckboxField } from "@/components/ui/checkbox";
import { FieldTextInput } from "@/components/ui/text-input";
import { Textarea } from "@/components/ui/textarea";
import { useQueryKey } from "@/lib/fetch";
import { useCurrentApp } from "@/lib/state";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { RESTGetAPIApplicationCommandResult } from "discord-api-types/v10";
import { useParams } from "wouter";

export default function EditCommand() {
	const { commandId } = useParams();
	const [currentApp] = useCurrentApp();
	const queryKey = useQueryKey([
		"applications",
		currentApp,
		"commands",
		commandId,
	]);
	const { data } = useQuery<RESTGetAPIApplicationCommandResult>({
		queryKey,
		enabled: currentApp != null,
	});
	const { Field } = useForm({
		defaultValues: data,
	});

	return (
		<main className="container mx-auto">
			<form>
				<Field name="name">
					{(field) => <FieldTextInput field={field} type="text" label="Name" />}
				</Field>
				<Field name="guild_id">
					{(field) => (
						<FieldTextInput
							field={field}
							type="text"
							label="Guild ID"
							disabled
						/>
					)}
				</Field>
				<Field name="description">
					{(field) => (
						<Textarea
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							value={field.state.value}
						/>
					)}
				</Field>
				<Field name="default_member_permissions">
					{(field) => (
						<FieldTextInput
							field={field}
							type="text"
							label="Default Member Permissions"
						/>
					)}
				</Field>
				<div className="flex items-center gap-2">
					<Field name="dm_permission">
						{(field) => <CheckboxField label="DM Permission" field={field} />}
					</Field>
					<Field name="default_permission">
						{(field) => (
							<CheckboxField label="Default Permission" field={field} />
						)}
					</Field>
					<Field name="nsfw">
						{(field) => <CheckboxField label="NSFW" field={field} />}
					</Field>
				</div>
			</form>
		</main>
	);
}
