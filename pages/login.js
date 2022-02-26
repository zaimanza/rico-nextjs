import {
    List,
    ListItem,
    Typography,
    TextField,
    Button,
    Link,
} from '@material-ui/core';
import Cookies from 'js-cookie';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import Layout from '../components/Layout';
import client from '../graphql/apollo-client';
import { userLogin } from '../graphql/schema/user/user-login';
import { Store } from '../utils/Store';
import useStyles from '../utils/styles';

export default function Login() {
    const router = useRouter();
    const { redirect } = router.query; // login?redirect=/shipping
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    useEffect(() => {
        if (userInfo) {
            router.push('/');
        }
    }, [router, userInfo]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const classes = useStyles();
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const { data } = await client.query({
                query: userLogin,
                variables: {
                    email: email,
                    password: password,
                }
            });
            dispatch({ type: 'USER_LOGIN', payload: data.userLogin });
            Cookies.set('userInfo', data);
            router.push(redirect || '/');
        } catch (err) {
            alert(err.response.data ? err.response.data.message : err.message);
        }
    };
    return (
        <Layout title="Login">
            <form onSubmit={submitHandler} className={classes.form}>
                <Typography component="h1" variant="h1">
                    Login
                </Typography>
                <List>
                    <ListItem>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="email"
                            label="Email"
                            inputProps={{ type: 'email' }}
                            onChange={(e) => setEmail(e.target.value)}
                        ></TextField>
                    </ListItem>
                    <ListItem>
                        <TextField
                            variant="outlined"
                            fullWidth
                            id="password"
                            label="Password"
                            inputProps={{ type: 'password' }}
                            onChange={(e) => setPassword(e.target.value)}
                        ></TextField>
                    </ListItem>
                    <ListItem>
                        <Button variant="contained" type="submit" fullWidth color="primary">
                            Login
                        </Button>
                    </ListItem>
                    <ListItem>
                        Don't have an account? &nbsp;
                        <NextLink href="/register" passHref>
                            <Link>Register</Link>
                        </NextLink>
                    </ListItem>
                </List>
            </form>
        </Layout>
    );
}