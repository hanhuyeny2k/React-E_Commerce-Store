import React, { useState, useEffect } from 'react';
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline} from '@material-ui/core';
import useStyles from './styles';
import AddressForm from '../AddressForm';
import PaymentForm from '../PaymentForm';
import { commerce } from '../../../lib/commerce';
import { Link, useHistory } from 'react-router-dom';

const steps = ['Shipping address', 'Payment details'];

const Checkout = ({cart, onCaptureCheckout, order, error}) => {
  const [activeStep, setActiveStep] = useState(0); //useState(1) takes to PaymentForm, useState(2) takes to Confirmation component
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});
  const [isFinished, setIsFinished] = useState(false); //by default isFinished is equal to false
  const classes = useStyles();
  const history = useHistory();

  const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
  const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);


  //to generate a checkout token and use it for paying and [] at end means it will mount from beginning but will
  //change that later because it would have to change
  useEffect(() => {
    if(cart.id) {
      const generateToken = async () => {
        try {
          const token = await commerce.checkout.generateToken(cart.id, {type:'cart'});
          setCheckoutToken(token);
        
        } catch (error) {
            if (activeStep !== steps.length) history.push('/'); //this is like a link taking you back to mainpage if there is error
        }
      };
      //once the checkout cart is updated then a new token is generated again
      generateToken();
    }
  }, [cart])


  //pass this function as a prop to our address form. Fn accept data that is passed from Addressform
  const next = (data) => {
    setShippingData(data);
    console.log(data);
    nextStep();

  }

  const timeout = () => {
    setTimeout(() => {
      setIsFinished(true)
    }, 3000);
  }

  let Confirmation = () => order.customer ? (
      <>
        <div>
          <Typography variant='h5'>Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
          <Divider className={classes.divider} />
          <Typography variant='subtitle2'>Order ref: {order.customer_reference}</Typography>
        </div>
        <br />
        <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
      </>
  ) : isFinished ? ( 
    <>
    <div> {/*this is for people who didn't enter their credit card detail*/}
      <Typography variant='h5'>Thank you for your purchase</Typography>
      <Divider className={classes.divider} />
    </div>
    <br />
    <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
  </>
  ) : (
      <div className={classes.spinner}>
        <CircularProgress /> {/*give customer something to look at instead of blank screen while loading*/}
      </div>
  );

  if(error) {
    Confirmation = () => (
    <>
      <Typography variant="h5">Error: {error}</Typography>
      <br />
      <Button component={Link} to='/' variant='outlined' type='button'>Back to Home</Button>
    </>
    );
}

  const Form = () => activeStep === 0
      ? <AddressForm checkoutToken={checkoutToken} next={next} />
      : <PaymentForm checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} shippingData={shippingData} onCaptureCheckout={onCaptureCheckout} timeout={timeout} />

  return (
      <>
        <CssBaseline />
        <div className={classes.toolbar} />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography variant='h4' align='center'>Checkout</Typography>
            <Stepper activeStep={0} className={classes.stepper}>
                {steps.map((step) => (
                  <Step key={step}>
                    <StepLabel>{step}</StepLabel>
                  </Step>
                ))}
            </Stepper> {/* if activeStep on the last step then we want to show Confrimation component else go to Form. only have checkoutToken then go to form */}
            {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
          </Paper>
        </main>
        
      </>
  )
}

export default Checkout