import type { DeepKeys, FieldApi, FieldComponent } from "@tanstack/react-form";
import type {
	APIApplicationCommand,
	APIApplicationCommandOption,
} from "discord-api-types/v10";
import {
	ApplicationCommandOptionType,
	ChannelType,
} from "discord-api-types/v10";
import { getAllEnumValues } from "enum-for";
import { CheckboxField, CheckboxFieldList } from "../ui/checkbox";
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

const SUB_OPTIONS = [
	ApplicationCommandOptionType.Subcommand,
	ApplicationCommandOptionType.SubcommandGroup,
];

const INPUT_OPTIONS = [
	ApplicationCommandOptionType.String,
	ApplicationCommandOptionType.Number,
	ApplicationCommandOptionType.Integer,
];

export type CommandOptionsEditProps = {
	readonly Field: FieldComponent<APIApplicationCommand>;
	readonly field: FieldApi<APIApplicationCommand, "options">;
};

export default function CommandOptionsEdit({
	field,
	Field,
}: CommandOptionsEditProps) {
	return (
		<>
			{field.state.value?.map((option, index) => (
				<CommandOptionEdit
					Field={Field}
					index={index}
					key={index}
					option={option}
				/>
			))}
		</>
	);
}

type CommandOptionEditProps = {
	readonly Field: FieldComponent<APIApplicationCommand>;
	readonly index: number;
	readonly option: APIApplicationCommandOption;
};

function CommandOptionEdit({ Field, index, option }: CommandOptionEditProps) {
	return (
		<>
			<Field name={`options[${index}].type`}>
				{(field) => (
					<LabeledElement label="Type">
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
								{getAllEnumValues(ApplicationCommandOptionType).map((type) => (
									<SelectItem key={type} value={type.toString()}>
										{ApplicationCommandOptionType[type]}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</LabeledElement>
				)}
			</Field>
			<Field name={`options[${index}].name`}>
				{(field) => <TextInputField field={field} label="Name" type="text" />}
			</Field>
			<Field name={`options[${index}].description`}>
				{(field) => <TextareaField field={field} label="Description" />}
			</Field>
			{!SUB_OPTIONS.includes(option.type) && (
				<Field name={`options[${index}].required`}>
					{(field) => <CheckboxField field={field} label="Required" />}
				</Field>
			)}
			{option.type === ApplicationCommandOptionType.Channel && (
				<Field name={`options[${index}].channel_types`}>
					{(field) => (
						<CheckboxFieldList
							field={field}
							label="Channel Types"
							options={ChannelType}
						/>
					)}
				</Field>
			)}
		</>
	);
}
