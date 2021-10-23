import { ExpandMore } from '@mui/icons-material';
import { MenuItem, TextField, Checkbox, Typography, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, AccordionProps, Button } from '@mui/material';
import { FastField, Field } from 'formik';
import CommandOptionList from './CommandOptionList';

export interface CommandOptionProps {
	option: CommandOptionFields,
	parent: string,
	controls?: Omit<AccordionProps, 'children'>,
	remove: () => void,
}

export interface CommandOptionFields {
	type: number,
	name: string,
	description: string,
	required: boolean,
	autocomplete: boolean,
	options?: CommandOptionFields[],
}

export default function CommandOption({ option, parent, remove, controls = {} }: CommandOptionProps) {
	return (
		<Accordion {...controls} TransitionProps={{ unmountOnExit: true }}>
			<AccordionSummary
				expandIcon={<ExpandMore />}
				aria-controls={`${parent}.content`}
				id={`${parent}.header`}
			>
				<Typography>{option.name || parent}</Typography>
			</AccordionSummary>
			<AccordionDetails
				id={`${parent}.content`}
			>
				<FastField
					as={TextField}
					name={`${parent}.type`}
					select
					required
					label="Type"
					margin="normal"
					helperText="Select the option type"
					variant="outlined"
				>
					<MenuItem value={1}>Sub Command</MenuItem>
					<MenuItem value={2}>Sub Command Group</MenuItem>
					<MenuItem value={3}>String</MenuItem>
					<MenuItem value={4}>Integer</MenuItem>
					<MenuItem value={5}>Boolean</MenuItem>
					<MenuItem value={6}>User</MenuItem>
					<MenuItem value={7}>Channel</MenuItem>
					<MenuItem value={8}>Role</MenuItem>
					<MenuItem value={9}>Mentionable</MenuItem>
					<MenuItem value={10}>Member</MenuItem>
				</FastField>
				<FastField
					as={TextField}
					name={`${parent}.name`}
					label="Name"
					fullWidth
					required
					margin="normal"
					variant="outlined"
				/>
				<FastField
					as={TextField}
					name={`${parent}.description`}
					label="Description"
					multiline
					fullWidth
					margin="normal"
					variant="outlined"
					maxRows="4"
				/>

				<FormControlLabel control={<Field type="checkbox" name={`${parent}.required`} as={Checkbox} />} label="Required" />
				{option.type === 3 && <FormControlLabel control={<Field type="checkbox" name={`${parent}.autocomplete`} as={Checkbox} />} label="Autocomplete" />}

				{option.type === 1 || option.type === 2 ? <CommandOptionList name={`${parent}.options`} options={option.options ?? []} /> : <></>}

				<Button onClick={remove}>Remove</Button>

			</AccordionDetails>
		</Accordion>
	);
}
