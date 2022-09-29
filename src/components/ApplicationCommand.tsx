import { Button, Checkbox, FormControlLabel, Grid, MenuItem, TextField } from '@mui/material';
import { FastField, Field, Form, Formik } from 'formik';
import { CommandOptionFields } from './CommandOption';
import CommandOptionList from './CommandOptionList';

export interface ApplicationCommandProps {
	command?: CommandFields,
	isGlobal: boolean,
	onSave: (values: CommandFields) => Promise<void> | void,
}

export interface CommandFields {
	name: string,
	type: number,
	description: string,
	dm_permission: boolean,
	options?: CommandOptionFields[],
}

function validateBitfield(value: string) {
	if (/^\d*$/.test(value)) return null;
	return 'Bitfields must be numeric';
}

export default function ApplicationCommand({
	onSave,
	isGlobal,
	command = { name: '', type: 1, description: '', dm_permission: true, options: [] }
}: ApplicationCommandProps) {
	return (
		<Formik initialValues={command} onSubmit={onSave}>
			{
				({ isSubmitting, values, errors }) => (
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

						{/* <FastField
							as={TextField}
							name="default_member_permissions"
							label="Default Member Permissions"
							margin="normal"
							validate={validateBitfield}
							error={errors.default_member_permissions}
							helperText={errors.default_member_permissions}
						/> */}
						{isGlobal && <FormControlLabel control={<Field type="checkbox" name="dm_permission" as={Checkbox} />} label="Allow in DMs" />}

						{values.type === 1 && <CommandOptionList name="options" options={values.options ?? []} />}

						<Button variant="contained" type="submit" disabled={isSubmitting}>Save</Button>
					</Form>
				)
			}
		</Formik>
	);
}
