import { useForm } from "@tanstack/react-form";
import type { APIApplicationCommand } from "discord-api-types/v10";
import { CheckboxField } from "../ui/checkbox";
import { TextInputField } from "../ui/text-input";
import { Textarea, TextareaField } from "../ui/textarea";

export default function CommandEdit({
	data,
}: {
	readonly data?: APIApplicationCommand;
}) {
	const { Field } = useForm({
		defaultValues: data,
	});

	return (
		<form>
			<Field name="name">
				{(field) => <TextInputField field={field} label="Name" type="text" />}
			</Field>
			{data?.guild_id && (
				<Field name="guild_id">
					{(field) => (
						<TextInputField
							disabled
							field={field}
							label="Guild ID"
							type="text"
						/>
					)}
				</Field>
			)}
			<Field name="description">
				{(field) => <TextareaField field={field} label="Description" />}
			</Field>
			<Field name="default_member_permissions">
				{(field) => (
					<TextInputField
						field={field}
						label="Default Member Permissions"
						type="text"
					/>
				)}
			</Field>
			<div className="flex items-center gap-2">
				<Field name="dm_permission">
					{(field) => <CheckboxField field={field} label="DM Permission" />}
				</Field>
				<Field name="default_permission">
					{(field) => (
						<CheckboxField field={field} label="Default Permission" />
					)}
				</Field>
				<Field name="nsfw">
					{(field) => <CheckboxField field={field} label="NSFW" />}
				</Field>
			</div>
		</form>
	);
}
