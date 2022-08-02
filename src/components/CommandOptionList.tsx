import { Typography, Button, Stack } from '@mui/material';
import { Box } from '@mui/system';
import { FieldArray } from 'formik';
import { useState, SyntheticEvent } from 'react';

import CommandOption, { CommandOptionFields } from './CommandOption';

export interface CommandOptionListProps {
	name: string,
	options: CommandOptionFields[]
}

export default function CommandOptionList({ name, options }: CommandOptionListProps) {
	const [expanded, setExpanded] = useState<string | null>(null);

	const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
		setExpanded(isExpanded ? panel : null);
	}

	return (
		<FieldArray name={name}>
			{({ remove, push }) => (
				<div>
					<Stack direction="row" spacing={2}>
						<Typography variant="h5">Options</Typography>
						<Button variant="outlined" onClick={() => {
							push({ type: 0, name: '', description: '', required: false, autocomplete: false, options: [] } as CommandOptionFields);
						}}>Add</Button>
					</Stack>
					<Box sx={{marginTop: 1, marginBottom: 1}}>
						{options.map((option, index) => {
							const newParent = `${name}[${index}]`;
							return (
								<CommandOption
									key={index}
									parent={newParent}
									option={option}
									remove={() => remove(index)}
									controls={{
										expanded: expanded === newParent,
										onChange: handleChange(newParent)
									}}
								/>
							);
						})}
					</Box>
				</div>
			)}
		</FieldArray>
	);
}
