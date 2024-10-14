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
import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
import { Heading } from "../ui/typography";

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
		<div className="flex flex-col gap-4">
			{field.state.value?.map((option, index) => (
				<CommandOptionEdit
					Field={Field}
					field={field}
					index={index}
					key={index}
					option={option}
				/>
			))}
		</div>
	);
}

type CommandOptionEditProps = {
	readonly Field: FieldComponent<APIApplicationCommand>;
	readonly field: FieldApi<APIApplicationCommand, "options">;
	readonly index: number;
	readonly option: APIApplicationCommandOption;
};

function CommandOptionEdit({
	Field,
	field,
	index,
	option,
}: CommandOptionEditProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-baseline">
					<span className="grow">{option.name}</span>
					<Button
						onClick={() => void field.removeValue(index)}
						variant="destructive"
					>
						<Trash2 size={18} />
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<div className="flex gap-2">
					<Field name={`options[${index}].type`}>
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
										{getAllEnumValues(ApplicationCommandOptionType).map(
											(type) => (
												<SelectItem key={type} value={type.toString()}>
													{ApplicationCommandOptionType[type]}
												</SelectItem>
											),
										)}
									</SelectContent>
								</Select>
							</LabeledElement>
						)}
					</Field>
					<Field name={`options[${index}].name`}>
						{(field) => (
							<TextInputField
								className="w-full"
								data-1pignore
								field={field}
								label="Name"
								type="text"
							/>
						)}
					</Field>
				</div>
				<Field name={`options[${index}].description`}>
					{(field) => <TextareaField field={field} label="Description" />}
				</Field>
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
					<div className="flex gap-2">
						<Field name={`options[${index}].min_value`}>
							{(field) => (
								<TextInputField
									className="grow"
									field={field}
									inputMode="numeric"
									label="Min Value"
									type="number"
								/>
							)}
						</Field>
						<Field name={`options[${index}].max_value`}>
							{(field) => (
								<TextInputField
									className="grow"
									field={field}
									inputMode="numeric"
									label="Max Value"
									type="number"
								/>
							)}
						</Field>
					</div>
				)}
				<div className="flex gap-2">
					{option.type === ApplicationCommandOptionType.String && (
						<Field name={`options[${index}].min_length`}>
							{(field) => (
								<TextInputField
									className="grow"
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
									className="grow"
									field={field}
									inputMode="numeric"
									label="Max Length"
									type="number"
								/>
							)}
						</Field>
					)}
				</div>
				{!SUB_OPTIONS.includes(option.type) && (
					<Field name={`options[${index}].required`}>
						{(field) => <CheckboxField field={field} label="Required" />}
					</Field>
				)}
				{INPUT_OPTIONS.includes(option.type) && (
					<Field name={`options[${index}].autocomplete`}>
						{(field) => <CheckboxField field={field} label="Autocomplete" />}
					</Field>
				)}
				{INPUT_OPTIONS.includes(option.type) && (
					<section>
						<Heading level={4}>Choices</Heading>
						<div className="flex flex-col gap-2">
							<Field mode="array" name={`options[${index}].choices`}>
								{(field) => (
									<CommandOptionChoicesEdit
										Field={Field}
										field={field}
										prefix={`options[${index}].choices`}
									/>
								)}
							</Field>
						</div>
					</section>
				)}
			</CardContent>
		</Card>
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
				<div className="flex gap-2 items-end" key={index}>
					<Field name={`${prefix}[${index}].name`}>
						{(field) => (
							<TextInputField
								className="grow"
								data-1pignore
								field={field}
								label="Name"
							/>
						)}
					</Field>
					<Field name={`${prefix}[${index}].value`}>
						{(field) => (
							<TextInputField className="grow" field={field} label="Value" />
						)}
					</Field>
					<Button
						aria-description="Remove"
						onClick={() => void field.removeValue(index)}
						type="button"
						variant="destructive"
					>
						<Trash2 size={18} />
					</Button>
				</div>
			))}
			<div>
				<Button
					onClick={() => field.pushValue({})}
					type="button"
					variant="secondary"
				>
					Add
				</Button>
			</div>
		</>
	);
}
