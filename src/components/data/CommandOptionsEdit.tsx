import type {
	APIApplicationCommand,
	APIApplicationCommandOption,
	APIApplicationCommandOptionChoice,
} from "discord-api-types/v10";
import {
	ApplicationCommandOptionType,
	ChannelType,
} from "discord-api-types/v10";
import { cloneDeep } from "lodash";
import { Trash2 } from "lucide-react";
import { useCallback } from "react";
import TextareaField, {
	CheckboxField,
	CheckboxFieldList,
	SelectField,
	TextInputField,
} from "../form/Field";
import { useValueByName, type Form } from "../form/context";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
	readonly form: Form<APIApplicationCommand>;
	readonly name: string;
};

export default function CommandOptionsEdit({
	form,
	name,
}: CommandOptionsEditProps) {
	const [options, setOptions] = useValueByName<
		any,
		APIApplicationCommand["options"]
	>(form, name);

	const removeValue = useCallback(
		(index: number) => {
			if (options) {
				const copy = cloneDeep(options);
				copy.splice(index, 1);
				setOptions(copy);
			}
		},
		[options, setOptions],
	);

	const addValue = useCallback(() => {
		setOptions([
			...(options ?? []),
			{ name: "", description: "", type: ApplicationCommandOptionType.String },
		]);
	}, [options, setOptions]);

	return (
		<div className="flex flex-col gap-4">
			{options?.map((option, index) => (
				<CommandOptionEdit
					form={form}
					index={index}
					key={index}
					name={name}
					option={option}
					removeValue={removeValue}
				/>
			))}
			<Button onClick={addValue} variant="secondary">
				Add
			</Button>
		</div>
	);
}

type CommandOptionEditProps = {
	readonly form: Form<APIApplicationCommand>;
	readonly index: number;
	readonly name: string;
	readonly option: APIApplicationCommandOption;
	removeValue(this: void, index: number): void;
};

function CommandOptionEdit({
	form,
	name,
	index,
	option,
	removeValue,
}: CommandOptionEditProps) {
	const elementName = `${name}[${index}]`;
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-baseline">
					<span className="grow">{option.name}</span>
					<Button
						aria-label="Remove option"
						onClick={() => removeValue(index)}
						variant="destructive"
					>
						<Trash2 size={18} />
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<div className="flex gap-2">
					<SelectField
						form={form}
						label="Type"
						name={`${elementName}.type`}
						options={ApplicationCommandOptionType}
					/>

					<TextInputField
						className="w-full"
						data-1pignore
						form={form}
						label="Name"
						name={`${elementName}.name`}
						type="text"
					/>
				</div>
				<TextareaField
					form={form}
					label="Description"
					name={`${elementName}.description`}
				/>
				{option.type === ApplicationCommandOptionType.Channel && (
					<CheckboxFieldList
						form={form}
						name={`${elementName}.channel_types`}
						options={ChannelType}
					/>
				)}
				{NUMBER_OPTIONS.includes(option.type) && (
					<div className="flex gap-2">
						<TextInputField
							className="grow"
							form={form}
							inputMode="numeric"
							label="Min Value"
							name={`${elementName}.min_value`}
							type="number"
						/>
						<TextInputField
							className="grow"
							form={form}
							inputMode="numeric"
							label="Max Value"
							name={`${elementName}.max_value`}
							type="number"
						/>
					</div>
				)}
				{option.type === ApplicationCommandOptionType.String && (
					<div className="flex gap-2">
						<TextInputField
							className="grow"
							form={form}
							inputMode="numeric"
							label="Min Length"
							name={`${elementName}.min_length`}
							type="number"
						/>
						<TextInputField
							className="grow"
							form={form}
							inputMode="numeric"
							label="Max Length"
							name={`${elementName}.max_length`}
							type="number"
						/>
					</div>
				)}
				{!SUB_OPTIONS.includes(option.type) && (
					<CheckboxField
						form={form}
						label="Required"
						name={`${elementName}.required`}
					/>
				)}
				{INPUT_OPTIONS.includes(option.type) && (
					<CheckboxField
						form={form}
						label="Autocomplete"
						name={`${elementName}.autocomplete`}
					/>
				)}
				{INPUT_OPTIONS.includes(option.type) && (
					<section>
						<Heading level={4}>Choices</Heading>
						<CommandOptionChoicesEdit
							form={form}
							name={`${elementName}.choices`}
						/>
					</section>
				)}
			</CardContent>
		</Card>
	);
}

type CommandOptionChoicesEditProps = {
	readonly form: Form<APIApplicationCommand>;
	readonly name: string;
};

function CommandOptionChoicesEdit({
	form,
	name,
}: CommandOptionChoicesEditProps) {
	const [choices, setChoices] = useValueByName<
		any,
		APIApplicationCommandOptionChoice<number | string>[] | undefined
	>(form, name);

	const removeValue = useCallback(
		(index: number) => {
			if (choices) {
				choices.splice(index, 1);
				setChoices([...choices]);
			}
		},
		[choices, setChoices],
	);

	const addValue = useCallback(() => {
		setChoices([...(choices ?? []), { name: "", value: "" }]);
	}, [choices, setChoices]);

	return (
		<div className="flex flex-col gap-2">
			{choices?.map((_, index) => {
				const elementName = `${name}[${index}]`;

				return (
					<div className="flex gap-2 items-end" key={index}>
						<TextInputField
							className="grow"
							data-1pignore
							form={form}
							label="Name"
							name={`${elementName}.name`}
						/>
						<TextInputField
							className="grow"
							form={form}
							label="Value"
							name={`${elementName}.value`}
						/>
						<Button
							aria-description="Remove"
							onClick={() => removeValue(index)}
							type="button"
							variant="destructive"
						>
							<Trash2 size={18} />
						</Button>
					</div>
				);
			})}
			<div>
				<Button onClick={() => addValue()} type="button" variant="secondary">
					Add
				</Button>
			</div>
		</div>
	);
}
