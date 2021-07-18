import React from 'react';
import { TextField, Grid, Input } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';

//you can manually make your own component instead of using FormInput given from Material UI
const FormInput = ({ name, label, control }) => {
  // const { control } = useFormContext();

  
  
  return (
    <Grid item xs={12} sm={6}>
      <Controller 
        render = {({ field }) => <TextField {...field} />}
            control={control}
            name={name}
            fullWidth
            label={label}
            defaultValue=""
            required  
          />
    </Grid>
  );
};

export default FormInput
