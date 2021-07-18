import React from 'react';
import { AppBar, Toolbar, IconButton, Badge, MenuItem, Menu, Typography } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import logo from '../../assets/safron.jpg'
import useStyles from './styles';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ totalItems }) => {
  const classes = useStyles();
  const location = useLocation();

  /*if(location.pathname === '/') => this is a hook. location has pathname property. if this is same out route then we show icon button */

  return (
      <AppBar position='fixed' className={classes.appBar} color='inherit'>
          <Toolbar>
            <Typography component={Link} to='/' variant='h6' className={classes.title} color='inherit'>
              <img src={logo} alt='Commerce.js' height='25px' className={classes.image} />
              Saffronatic Ecommerce
            </Typography>
            <div className={classes.grow} />
            {location.pathname === '/' && (
            <div className={classes.button} >
                <IconButton component={Link} to='/cart' aria-label='Show cart items' color='inherit'>
                  <Badge badgeContent={totalItems} color='secondary'>
                    <ShoppingCart />
                  </Badge>
                </IconButton>
            </div> )} {/* && means "only" if we are on home route then we show the button or else we show nothing*/}
          </Toolbar>
      </AppBar>
  )
}

export default Navbar
