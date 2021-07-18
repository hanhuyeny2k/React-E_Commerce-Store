import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import { Link } from "react-router-dom";
import FormInput from './CustomTextField';
import { commerce } from '../../lib/commerce';

const AddressForm = ({checkoutToken, next}) => {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');
  
  const { control, handleSubmit } = useForm();
  // const methods = useForm();
  // const { control, handleSubmit } = useForm();


  // const onSubmit = (data) => {
  //   alert(JSON.stringify(data));
  // }

  {/* this gives the keys and values in that object and countries var is an obj, not an array then this become an obj inside an array*/}
  const otherCountries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name}));
  const otherSubdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name}));
  const otherOptions = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})`}));


  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);
    //countries right now is an obj so we need to turn it into an array in order to loop through it.
    // console.log(countries);
    setShippingCountries(countries);
    //get [AL, AT, BA] etc. these are the keys initial of each country
    setShippingCountry(Object.keys(countries)[0]);
  };

  //getting back the response but need to destructure it so become { subdivision }
  const fetchShippingSubdivisions = async (countryCode) => {
    const {subdivisions} = await commerce.services.localeListSubdivisions(countryCode);

    setShippingSubdivisions(subdivisions);
    //[0] is the first one got selected
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (checkoutTokenId, country, stateProvince = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, {country, region: stateProvince});
    console.log(options);
    //this options is an array instead of obj
    setShippingOptions(options);
    setShippingOption(options[0]);
    
  }
  //fetch the shippingcountries first thing after fill out the address form so we use useEffect
  useEffect(() => {
    fetchShippingCountries(checkoutToken.id)
  }, []);

  //when the shippingcountry dependency changes then we going to use tis useEffect
  //if shippingCountry exist then call the fetch fn
  useEffect(() => {
    if(shippingCountry) fetchShippingSubdivisions(shippingCountry)
  }, [shippingCountry]);

  useEffect(() => {
    if(shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision)
  }, [shippingSubdivision]);

  return (
    <>
        <Typography variant='h6' gutterbottom>Shipping Address</Typography>
        <FormProvider> {/*whatever we get from FormInput will become data */}
          <form onSubmit={handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption }))}> {/*...data has all the property from the current Forminput spread. We want to spread the data into this obj called ...data and then include what's the the <Grid> using var names */}
            <Grid container spacing={3}>
                <FormInput name='firstName' label='First Name' control={control} />
                <FormInput name='lastName' label='Last Name' control={control} />
                <FormInput name='address' label='Address' control={control} />
                <FormInput name='email' label='Email' control={control} />
                <FormInput name='city' label='City' control={control} />
                <FormInput name='zipcode' label='Zipcode' control={control} />
                <Grid item xs={12} sm={6}>
                  <InputLabel>Shipping Country</InputLabel> {/*whatever is selected will be the shippingcountry*/} 
                  <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                    {otherCountries.map((country) => (
                      <MenuItem key={country.id} value={country.id}>
                        {country.label}
                    </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Shipping Subdivision</InputLabel>
                  <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                    {otherSubdivisions.map((subdivision) =>
                      <MenuItem key={subdivision.id} value={subdivision.id}>
                        {subdivision.label}
                      </MenuItem>
                    )}
                  </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <InputLabel>Shipping Options</InputLabel>
                  <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                    {otherOptions.map((option) =>
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    )}
                  </Select>
                </Grid>
            </Grid>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
              <Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
              <Button type="submit" variant="contained" color="primary">Next</Button>
            </div>
          </form>
        </FormProvider>
    </>
  )
}

export default AddressForm
