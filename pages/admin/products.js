
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer } from 'react';
import {
    CircularProgress,
    Grid,
    List,
    ListItem,
    Typography,
    Card,
    Button,
    ListItemText,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from '@material-ui/core';
import { Store } from '../../utils/Store';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import { getManyProduct } from '../../graphql/schema/product/get-many-product';

import { useSnackbar } from 'notistack';
import { deleteProductById } from '../../graphql/schema/admin/admin-product/delete-product-by-id';
import { addDummyProduct } from '../../graphql/schema/admin/admin-product/add-dummy-product';
import useGraphql from '../../graphql/useGraphql';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, products: action.payload, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'CREATE_REQUEST':
            return { ...state, loadingCreate: true };
        case 'CREATE_SUCCESS':
            return { ...state, loadingCreate: false };
        case 'CREATE_FAIL':
            return { ...state, loadingCreate: false };
        case 'DELETE_REQUEST':
            return { ...state, loadingDelete: true };
        case 'DELETE_SUCCESS':
            return { ...state, loadingDelete: false, successDelete: true };
        case 'DELETE_FAIL':
            return { ...state, loadingDelete: false };
        case 'DELETE_RESET':
            return { ...state, loadingDelete: false, successDelete: false };
        default:
            state;
    }
}

function AdminProdcuts() {
    const { state } = useContext(Store);
    const router = useRouter();
    const classes = useStyles();
    const { userInfo } = state;

    const [
        { loading, error, products, loadingCreate, successDelete, loadingDelete },
        dispatch,
    ] = useReducer(reducer, {
        loading: true,
        products: [],
        error: '',
    });

    const [query] = useGraphql()

    useEffect(() => {
        if (!userInfo) {
            router.push('/login');
        }
        const fetchData = async () => {
            try {
                dispatch({ type: 'FETCH_REQUEST' });

                const data = await query(getManyProduct, {});

                dispatch({ type: 'FETCH_SUCCESS', payload: data.getManyProduct });
            } catch (err) {
                dispatch({ type: 'FETCH_FAIL', payload: "There's an error" });
            }
        };
        if (successDelete) {
            dispatch({ type: 'DELETE_RESET' });
        } else {
            fetchData();
        }
    }, [successDelete]);

    const { enqueueSnackbar } = useSnackbar();
    const createHandler = async () => {
        try {
            dispatch({ type: 'CREATE_REQUEST' });
            console.log("HI")
            const data = await query(addDummyProduct, {});
            dispatch({ type: 'CREATE_SUCCESS' });
            enqueueSnackbar('Product created successfully', { variant: 'success' });
            router.push(`/admin/product/${data.addDummyProduct._id}`);
        } catch (err) {
            dispatch({ type: 'CREATE_FAIL' });
            enqueueSnackbar("There's an error", { variant: 'error' });
        }
    };
    const deleteHandler = async (productId) => {
        if (!window.confirm('Are you sure?')) {
            return;
        }
        try {
            dispatch({ type: 'DELETE_REQUEST' });
            await query(deleteProductById, {
                deleteProductByIdId: productId,
            });
            dispatch({ type: 'DELETE_SUCCESS' });
            enqueueSnackbar('Product deleted successfully', { variant: 'success' });
        } catch (err) {
            dispatch({ type: 'DELETE_FAIL' });
            enqueueSnackbar("There's an error", { variant: 'error' });
        }
    };

    return (
        <Layout title="Products">
            <Grid container spacing={1}>
                <Grid item md={3} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <NextLink href="/admin/dashboard" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Admin Dashboard"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/orders" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Orders"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/products" passHref>
                                <ListItem selected button component="a">
                                    <ListItemText primary="Products"></ListItemText>
                                </ListItem>
                            </NextLink>
                            <NextLink href="/admin/users" passHref>
                                <ListItem button component="a">
                                    <ListItemText primary="Users"></ListItemText>
                                </ListItem>
                            </NextLink>
                        </List>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Grid container alignItems="center">
                                    <Grid item xs={6}>
                                        <Typography component="h1" variant="h1">
                                            Products
                                        </Typography>
                                        {loadingDelete && <CircularProgress />}
                                    </Grid>
                                    <Grid align="right" item xs={6}>
                                        <Button
                                            onClick={createHandler}
                                            color="primary"
                                            variant="contained"
                                        >
                                            Create
                                        </Button>
                                        {loadingCreate && <CircularProgress />}
                                    </Grid>
                                </Grid>
                            </ListItem>

                            <ListItem>
                                {loading ? (
                                    <CircularProgress />
                                ) : error ? (
                                    <Typography className={classes.error}>{error}</Typography>
                                ) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>ID</TableCell>
                                                    <TableCell>NAME</TableCell>
                                                    <TableCell>PRICE</TableCell>
                                                    <TableCell>CATEGORY</TableCell>
                                                    <TableCell>COUNT</TableCell>
                                                    <TableCell>RATING</TableCell>
                                                    <TableCell>ACTIONS</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {products.map((product) => (
                                                    <TableRow key={product._id}>
                                                        <TableCell>
                                                            {product._id.substring(20, 24)}
                                                        </TableCell>
                                                        <TableCell>{product.name}</TableCell>
                                                        <TableCell>${product.price}</TableCell>
                                                        <TableCell>{product.category}</TableCell>
                                                        <TableCell>{product.countInStock}</TableCell>
                                                        <TableCell>{product.rating}</TableCell>
                                                        <TableCell>
                                                            <NextLink
                                                                href={`/admin/product/${product._id}`}
                                                                passHref
                                                            >
                                                                <Button size="small" variant="contained">
                                                                    Edit
                                                                </Button>
                                                            </NextLink>{' '}
                                                            <Button
                                                                onClick={() => deleteHandler(product._id)}
                                                                size="small"
                                                                variant="contained"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export default dynamic(() => Promise.resolve(AdminProdcuts), { ssr: false });