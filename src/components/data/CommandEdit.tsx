import {
	ApplicationCommandType,
	type APIApplicationCommand,
	ApplicationIntegrationType,
	InteractionContextType,
} from "discord-api-types/v10";
import { array, boolean, number, object, string } from "yup";
import TextareaField, {
	CheckboxField,
	CheckboxFieldList,
	SelectField,
	TextInputField,
} from "../form/Field";
import { useForm } from "../form/context";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Heading } from "../ui/typography";
import CommandOptionsEdit from "./CommandOptionsEdit";

const schema = object({
	type: number(),
	name: string().min(1),
	default_member_permissions: number().nullable(),
	options: array(
		object({
			type: number(),
			name: string(),
			description: string(),
			required: boolean().optional(),
			choices: array(object({ name: string(), value: string() })).optional(),
			channel_types: array(number()).optional(),
			min_value: number().optional(),
			max_value: number().optional(),
			min_length: number().optional(),
			max_length: number().optional(),
		}),
	),
});

export default function CommandEdit({
	data,
	onSubmit,
}: {
	readonly data: APIApplicationCommand;
	onSubmit(this: void, value: APIApplicationCommand): void;
}) {
	const form = useForm({ data, onSubmit, validator: schema });

	return (
		<form className="flex flex-col gap-2" onSubmit={form.handleSubmit}>
			<div className="flex gap-2">
				<SelectField
					form={form}
					label="Type"
					name="type"
					options={ApplicationCommandType}
				/>
				<TextInputField
					className="grow"
					data-1pignore
					form={form}
					label="Name"
					name="name"
					type="text"
				/>
			</div>
			{data?.guild_id && (
				<TextInputField
					disabled
					form={form}
					label="Guild ID"
					name="guild_id"
					type="text"
				/>
			)}
			<TextareaField form={form} label="Description" name="description" />
			<TextInputField
				form={form}
				label="Default Member Permissions"
				name="default_member_permissions"
				type="text"
			/>
			<CheckboxField form={form} label="DM Permission" name="dm_permission" />
			<CheckboxField
				form={form}
				label="Default Permission"
				name="default_permission"
			/>
			<CheckboxField form={form} label="NSFW" name="nsfw" />
			<Heading level={2}>Integration Types</Heading>
			<CheckboxFieldList
				form={form}
				name="integration_types"
				options={ApplicationIntegrationType}
			/>
			<Heading level={2}>Contexts</Heading>
			<CheckboxFieldList
				form={form}
				name="contexts"
				options={InteractionContextType}
			/>
			<section className="flex flex-col gap-4">
				<Heading level={2}>Options</Heading>
				<CommandOptionsEdit form={form} name="options" />
			</section>
			<Separator />
			<div className="flex gap-2 justify-end">
				<Button type="submit">Save</Button>
			</div>
		</form>
	);
}
