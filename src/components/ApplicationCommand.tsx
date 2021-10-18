import { Button, Checkbox, FormControlLabel, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { FastField, Field, Form, Formik } from 'formik';
import { CommandOptionFields } from './CommandOption';
import CommandOptionList from './CommandOptionList';

export interface ApplicationCommandProps {
	command?: CommandFields,
	onSave: (values: CommandFields) => Promise<void> | void,
}

export interface CommandFields {
	name: string,
	type: number,
	description: string,
	default_permission: boolean,
	options?: CommandOptionFields[],
}

export default function ApplicationCommand({
	onSave,
	command = { name: '', type: 1, description: '', default_permission: true, options: [] }
}: ApplicationCommandProps) {
	return (
		<Formik initialValues={command} onSubmit={onSave}>
			{
				({ isSubmitting, values }) => (
					<Form>
						<Grid container spacing={6}>
							<Grid item>
								<FastField
									as={TextField}
									select
									name="type"
									label="Type"
									margin="normal"
									helperText="Select the command type"
									variant="outlined"
									required
								>
									<MenuItem value={1}>Chat Input</MenuItem>
									<MenuItem value={2}>User</MenuItem>
									<MenuItem value={3}>Message</MenuItem>
								</FastField>
							</Grid>
							<Grid item xs>
								<FastField
									as={TextField}
									name="name"
									label="Name"
									fullWidth
									margin="normal"
									variant="outlined"
									required />
							</Grid>
						</Grid>
						{values.type === 1 &&
							<FastField
								as={TextField}
								name="description"
								label="Description"
								minRows={4}
								maxRows={8}
								multiline
								fullWidth
								required
								margin="normal"
								variant="outlined"
							/>
						}

						<FormControlLabel control={<Field type="checkbox" name="default_permission" as={Checkbox} />} label="Default Permission" />

						{values.type === 1 && <CommandOptionList name="options" options={values.options ?? []} />}

						<Button variant="contained" type="submit" disabled={isSubmitting}>Save</Button>
					</Form>
				)
			}
		</Formik>
	);
}
