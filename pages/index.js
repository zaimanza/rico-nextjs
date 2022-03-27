import {
  Grid,
} from '@material-ui/core';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
import client from '../graphql/apollo-client';
import { checkStockOneProduct } from '../graphql/schema/product/check-stock-one-product';
import { getManyProduct } from '../graphql/schema/product/get-many-product';
import { Store } from '../utils/Store';


export default function Home(props) {
  const [result, setResult] = useState([]);
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { products } = props;
  useEffect(() => {

    const initialRun = async () => {
      const { data } = await client.query({
        query: getManyProduct,
      });
      console.log('hello')
      console.log(data.getManyProduct)
      await dispatch({ type: 'ADD_PRODUCTS', payload: data.getManyProduct });
      setResult(data.getManyProduct)
      console.log(result)
    }
    initialRun()
  }, []);
  const addToCartHandler = async (product) => {
    console.log(state.products)
    // const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    // const quantity = existItem ? existItem.quantity + 1 : 1;
    // const { data } = await client.query({
    //   query: checkStockOneProduct,
    //   variables: {
    //     checkStockOneProductId: product._id,
    //     quantity: quantity
    //   }
    // });
    // if (!data.checkStockOneProduct) {
    //   window.alert('Sorry. Product is out of stock');
    //   return;
    // }
    // dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    // router.push('/cart');
  };
  return (
    <Layout>
      <div>
        <h1>Products</h1>
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item md={4} key={product.name}>
              <ProductItem
                product={product}
                addToCartHandler={addToCartHandler}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {

  const { data } = await client.query({
    query: getManyProduct,
  });

  return {
    props: {
      products: data.getManyProduct,
    },
  };
}