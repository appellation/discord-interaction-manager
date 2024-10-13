import { useForm } from "@tanstack/react-form";
import {
	ApplicationCommandType,
	type APIApplicationCommand,
} from "discord-api-types/v10";
import { getAllEnumValues } from "enum-for";
import { CheckboxField } from "../ui/checkbox";
import { LabeledElement } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { TextInputField } from "../ui/text-input";
import { TextareaField } from "../ui/textarea";
import { Heading } from "../ui/typography";
import CommandOptionsEdit from "./CommandOptionsEdit";

export default function CommandEdit({
	data,
}: {
	readonly data?: APIApplicationCommand;
}) {
	const { Field } = useForm({
		defaultValues: data,
	});

	return (
		<form className="flex flex-col gap-2">
			<div className="flex gap-2">
				<Field name="type">
					{(field) => (
						<LabeledElement className="w-64" label="Type">
							<Select
								onValueChange={(value) =>
									field.handleChange(Number.parseInt(value, 10))
								}
								value={field.state.value.toString()}
							>
								<SelectTrigger>
									<SelectValue placeholder="Type" />
								</SelectTrigger>
								<SelectContent>
									{getAllEnumValues(ApplicationCommandType).map((type) => (
										<SelectItem key={type} value={type.toString()}>
											{ApplicationCommandType[type]}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</LabeledElement>
					)}
				</Field>
				<Field name="name">
					{(field) => (
						<TextInputField
							className="grow"
							field={field}
							label="Name"
							type="text"
						/>
					)}
				</Field>
			</div>
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
			<Field name="dm_permission">
				{(field) => <CheckboxField field={field} label="DM Permission" />}
			</Field>
			<Field name="default_permission">
				{(field) => <CheckboxField field={field} label="Default Permission" />}
			</Field>
			<Field name="nsfw">
				{(field) => <CheckboxField field={field} label="NSFW" />}
			</Field>
			<section>
				<Heading level={2}>Options</Heading>
				<Field name="options">
					{(field) => <CommandOptionsEdit Field={Field} field={field} />}
				</Field>
			</section>
		</form>
	);
}
