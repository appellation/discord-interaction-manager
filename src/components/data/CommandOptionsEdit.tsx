import type { FieldApi, FieldComponent } from "@tanstack/react-form";
import type {
	APIApplicationCommand,
	APIApplicationCommandOption,
} from "discord-api-types/v10";
import {
	ApplicationCommandOptionType,
	ChannelType,
} from "discord-api-types/v10";
import { getAllEnumValues } from "enum-for";
import { Fragment } from "react";
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

const NUMBER_OPTIONS = [
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
			{INPUT_OPTIONS.includes(option.type) && (
				<Field mode="array" name={`options[${index}].choices`}>
					{(field) => (
						<CommandOptionChoicesEdit
							Field={Field}
							field={field}
							prefix={`options[${index}].choices`}
						/>
					)}
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
			{NUMBER_OPTIONS.includes(option.type) && (
				<Field name={`options[${index}].min_value`}>
					{(field) => (
						<TextInputField
							field={field}
							inputMode="numeric"
							label="Min Value"
							type="number"
						/>
					)}
				</Field>
			)}
			{NUMBER_OPTIONS.includes(option.type) && (
				<Field name={`options[${index}].max_value`}>
					{(field) => (
						<TextInputField
							field={field}
							inputMode="numeric"
							label="Max Value"
							type="number"
						/>
					)}
				</Field>
			)}
			{option.type === ApplicationCommandOptionType.String && (
				<Field name={`options[${index}].min_length`}>
					{(field) => (
						<TextInputField
							field={field}
							inputMode="numeric"
							label="Min Length"
							type="number"
						/>
					)}
				</Field>
			)}
			{option.type === ApplicationCommandOptionType.String && (
				<Field name={`options[${index}].max_length`}>
					{(field) => (
						<TextInputField
							field={field}
							inputMode="numeric"
							label="Max Length"
							type="number"
						/>
					)}
				</Field>
			)}
			{INPUT_OPTIONS.includes(option.type) && (
				<Field name={`options[${index}].autocomplete`}>
					{(field) => <CheckboxField field={field} label="Autocomplete" />}
				</Field>
			)}
		</>
	);
}

type CommandOptionChoicesEditProps = {
	readonly Field: FieldComponent<any>;
	readonly field: FieldApi<any, any>;
	readonly prefix: string;
};

function CommandOptionChoicesEdit({
	Field,
	prefix,
	field,
}: CommandOptionChoicesEditProps) {
	return (
		<>
			{(field.state.value as any[] | undefined)?.map((_, index) => (
				<Fragment key={index}>
					<Field name={`${prefix}[${index}].name`}>
						{(field) => <TextInputField field={field} label="Name" />}
					</Field>
					<Field name={`${prefix}[${index}].value`}>
						{(field) => <TextInputField field={field} label="Value" />}
					</Field>
				</Fragment>
			))}
		</>
	);
}
