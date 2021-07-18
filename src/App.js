import React, { useState, useEffect } from 'react'; //useEffect fetch the product
import { commerce } from './lib/commerce'; // use the instance commerce to do all the backend work.
import { Products, Navbar, Cart, Checkout } from './components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const App = () => {
  const [products, setProducts] = useState([]);// by default our product is going to be an empty array. Fetch product.
  const [cart, setCart] = useState({});
  const [order, setOrder] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  //async is like using .then and .catch but  with cleaner code
  const fetchProducts = async () => {
      const {data} = await commerce.products.list(); //this return a promise so we have to WAIT to see what inside the promise.
       /*once we get response aka data aka product, we can destructure what inside the response. Data has info of what inside of product.
      now the product is populated. */ 
      setProducts(data);
  }

  const fetchCart = async () => {
      setCart(await commerce.cart.retrieve())
  }

  const handleAddToCart = async (productId, quantity) => {
      const item = await commerce.cart.add(productId, quantity);
      setCart(item.cart);
  }
  
  const handleUpdateCartQty = async (productId, quantity) => {
    const { cart } = await commerce.cart.update(productId, { quantity });

    setCart(cart);
  };

  const handleRemoveFromCart = async (productId) => {
    const { cart } = await commerce.cart.remove(productId);

    setCart(cart);
  };

  const handleEmptyCart = async () => {
    const { cart } = await commerce.cart.empty();

    setCart(cart);
  };

  const refreshCart = async () => {
    const newCart = await commerce.cart.refresh();

    setCart(newCart);
  };

  const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
    console.log(newOrder);
    try {
      const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder);

      setOrder(incomingOrder);
      refreshCart();
      // console.log(order);
    } catch (error) {
        setErrorMessage(error.data.error.message);
    }
  };
  //this will run at the start of render when have [] at end.
  //useEffect is a component that mount.
  useEffect(() => {
      fetchProducts();
      fetchCart();
  }, []);

  console.log(cart);


  return (
    <Router>
    <div>
      <Navbar totalItems={cart.total_items} />
      <Switch>
        <Route exact path='/'>
            <Products products={products} onAddToCart={handleAddToCart} handleUpdateCartQty />
        </Route>
        <Route exact path='/cart'>
           <Cart 
              cart={cart}
              onUpdateCartQty={handleUpdateCartQty}
              onRemoveFromCart={handleRemoveFromCart}
              onEmptyCart={handleEmptyCart}
            />
        </Route>
        <Route exact path='/checkout'>
          <Checkout 
            cart={cart}
            order={order}
            onCaptureCheckout={handleCaptureCheckout}
            error={errorMessage} 
          />
        </Route>
      </Switch>
    </div>
    </Router>
  )
}

export default App