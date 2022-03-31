import { ApolloProvider } from '@apollo/client';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import '../styles/globals.css';
import { StoreProvider } from '../utils/Store';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import useApolloClient from '../graphql/useApolloClient';

function MyApp({ Component, pageProps }) {
  const [client] = useApolloClient()
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  return (
    <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
      <ApolloProvider client={client}>
        <StoreProvider>
          <PayPalScriptProvider deferLoading={true}>
            <Component {...pageProps} />
          </PayPalScriptProvider>
        </StoreProvider>
      </ApolloProvider>
    </SnackbarProvider>
  );
}

export default MyApp;