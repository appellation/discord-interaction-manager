import { useForm } from "@tanstack/react-form";
import {
	ApplicationCommandType,
	type APIApplicationCommand,
	ApplicationCommandOptionType,
	ApplicationIntegrationType,
	InteractionContextType,
} from "discord-api-types/v10";
import { getAllEnumValues } from "enum-for";
import type { FormEvent } from "react";
import { useCallback } from "react";
import { Button } from "../ui/button";
import { CheckboxField, CheckboxFieldList } from "../ui/checkbox";
import { LabeledElement } from "../ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { TextInputField } from "../ui/text-input";
import { TextareaField } from "../ui/textarea";
import { Heading } from "../ui/typography";
import CommandOptionsEdit from "./CommandOptionsEdit";

export default function CommandEdit({
	data,
	onSubmit,
}: {
	readonly data?: APIApplicationCommand;
	onSubmit(this: void, props: { value: APIApplicationCommand }): void;
}) {
	const { Field, handleSubmit } = useForm({
		defaultValues: data,
		onSubmit,
	});

	const submitHandler = useCallback(
		(event: FormEvent<HTMLFormElement>) => {
			event.preventDefault();
			void handleSubmit();
		},
		[handleSubmit],
	);

	return (
		<form className="flex flex-col gap-2" onSubmit={submitHandler}>
			<div className="flex gap-2">
				<Field name="type">
					{(field) => (
						<LabeledElement className="w-64" label="Type">
							<Select
								onValueChange={(value) =>
									field.handleChange(Number.parseInt(value, 10))
								}
								value={field.state.value?.toString()}
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
							data-1pignore
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
			<Field mode="array" name="integration_types">
				{(field) => (
					<CheckboxFieldList
						field={field}
						label="Integration Types"
						options={ApplicationIntegrationType}
					/>
				)}
			</Field>
			<Field name="contexts">
				{(field) => (
					<CheckboxFieldList
						field={field}
						label="Contexts"
						options={InteractionContextType}
					/>
				)}
			</Field>
			<section className="flex flex-col gap-4">
				<Heading level={2}>Options</Heading>
				<Field mode="array" name="options">
					{(field) => (
						<>
							<CommandOptionsEdit Field={Field} field={field} />
							<Button
								onClick={() =>
									field.pushValue({
										type: ApplicationCommandOptionType.String,
										name: "",
										description: "",
									})
								}
								type="button"
								variant="secondary"
							>
								Add
							</Button>
						</>
					)}
				</Field>
			</section>
			<Separator />
			<div className="flex gap-2 justify-end">
				<Button type="submit">Save</Button>
			</div>
		</form>
	);
}
