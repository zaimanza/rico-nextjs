
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import React, { useEffect, useContext, useReducer, useState } from 'react';
import {
    Grid,
    List,
    ListItem,
    Typography,
    Card,
    Button,
    ListItemText,
    TextField,
    CircularProgress,
} from '@material-ui/core';
import { Store } from '../../../utils/Store';
import Layout from '../../../components/Layout';
import useStyles from '../../../utils/styles';
import { Controller, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getProductById } from '../../../graphql/schema/admin/admin-product/get-product-by-id';
import { updateProductById } from '../../../graphql/schema/admin/admin-product/update-product-by-id';
import { s3ProductUploadUrl } from '../../../graphql/schema/product/s3-product-upload-url';
import client from '../../../graphql/apollo-client';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';

function reducer(state, action) {
    switch (action.type) {
        case 'FETCH_REQUEST':
            return { ...state, loading: true, error: '' };
        case 'FETCH_SUCCESS':
            return { ...state, loading: false, error: '' };
        case 'FETCH_FAIL':
            return { ...state, loading: false, error: action.payload };
        case 'UPDATE_REQUEST':
            return { ...state, loadingUpdate: true, errorUpdate: '' };
        case 'UPDATE_SUCCESS':
            return { ...state, loadingUpdate: false, errorUpdate: '' };
        case 'UPDATE_FAIL':
            return { ...state, loadingUpdate: false, errorUpdate: action.payload };
        case 'UPLOAD_REQUEST':
            return { ...state, loadingUpload: true, errorUpload: '' };
        case 'UPLOAD_SUCCESS':
            return {
                ...state,
                loadingUpload: false,
                errorUpload: '',
            };
        case 'UPLOAD_FAIL':
            return { ...state, loadingUpload: false, errorUpload: action.payload };

        default:
            return state;
    }
}

function ProductEdit({ params }) {
    const productId = params.id;
    const [getToUploadToS3Obj, setToUploadToS3Obj] = useState({});
    const [getImageViewData, setImageViewData] = useState("");
    const { state } = useContext(Store);
    const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
        loading: true,
        error: '',
    });
    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue,
    } = useForm();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const router = useRouter();
    const classes = useStyles();
    const { userInfo } = state;

    useEffect(() => {
        if (!userInfo) {
            return router.push('/login');
        } else {
            const fetchData = async () => {
                try {
                    dispatch({ type: 'FETCH_REQUEST' });
                    const { data } = await client.query({
                        query: getProductById,
                        variables: {
                            getProductByIdId: productId,
                        }
                    });
                    dispatch({ type: 'FETCH_SUCCESS' });
                    setValue('name', data.getProductById.name);
                    setValue('slug', data.getProductById.slug);
                    setValue('price', data.getProductById.price);
                    setValue('image', data.getProductById.image);
                    setImageViewData(data.getProductById.image)
                    setValue('category', data.getProductById.category);
                    setValue('brand', data.getProductById.brand);
                    setValue('countInStock', data.getProductById.countInStock);
                    setValue('description', data.getProductById.description);
                } catch (err) {
                    dispatch({ type: 'FETCH_FAIL', payload: "There's an error" });
                }
            };
            fetchData();
        }
    }, [productId, router, setValue, userInfo]);
    const uploadHandler = async (e, imageField = 'image') => {
        try {
            const file = e.target.files[0];
            const bodyFormData = new FormData();
            bodyFormData.append('file', file);

            dispatch({ type: 'UPLOAD_REQUEST' });

            var reader = new FileReader();
            reader.onload = function () {
                setToUploadToS3Obj(file)
                console.log(file)
                dispatch({ type: 'UPLOAD_SUCCESS' });
                setImageViewData(reader.result)
                setValue(imageField, reader.result);
                enqueueSnackbar('File uploaded successfully', { variant: 'success' });
            }
            reader.readAsDataURL(e.target.files[0]);
            // now 
            //this one waktu submit form
            // call s3url
            // upload to s3
            // save to setValue
        } catch (err) {
            dispatch({ type: 'UPLOAD_FAIL', payload: "There's an error" });
            enqueueSnackbar("There's an error", { variant: 'error' });
        }
    };
    const submitHandler = async ({
        name,
        slug,
        price,
        category,
        brand,
        countInStock,
        description,
    }) => {
        closeSnackbar();
        try {
            dispatch({ type: 'UPDATE_REQUEST' });
            let updateData = {
                name: name,
                slug: slug,
                price: price,
                category: category,
                // image: image,
                brand: brand,
                countInStock: countInStock,
                description: description,
            }
            const file = getToUploadToS3Obj

            if (Object.keys(file).length === 0) {
                const options = {
                    maxSizeMB: 1,
                    maxWidthOrHeight: 600,
                    useWebWorker: true
                }
                const compressedFile = await imageCompression(file, options);
                //get upload url
                const { data } = await client.query({
                    query: s3ProductUploadUrl,
                });
                //put to aws
                await fetch(data.s3ProductUploadUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    body: compressedFile
                }).catch(error => {
                    enqueueSnackbar("There's an error", error);
                    console.error('There was an error!', error);
                })

                const awsImageUrl = data.s3ProductUploadUrl.split('?')[0]
                // add to updateData
                updateData.image = awsImageUrl

            }
            await client.query({
                query: updateProductById,
                variables: {
                    updateProductByIdId: productId,
                    updateData: updateData,
                }
            });
            dispatch({ type: 'UPDATE_SUCCESS' });
            enqueueSnackbar('Product updated successfully', { variant: 'success' });
            router.push('/admin/products');
        } catch (err) {
            dispatch({ type: 'UPDATE_FAIL', payload: "There's an error" });
            enqueueSnackbar("There's an error", { variant: 'error' });
        }
    };
    return (
        <Layout title={`Edit Product ${productId}`}>
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
                        </List>
                    </Card>
                </Grid>
                <Grid item md={9} xs={12}>
                    <Card className={classes.section}>
                        <List>
                            <ListItem>
                                <Typography component="h1" variant="h1">
                                    Edit Product {productId}
                                </Typography>
                            </ListItem>
                            <ListItem>
                                {loading && <CircularProgress></CircularProgress>}
                                {error && (
                                    <Typography className={classes.error}>{error}</Typography>
                                )}
                            </ListItem>
                            <ListItem>
                                <form
                                    onSubmit={handleSubmit(submitHandler)}
                                    className={classes.form}
                                >
                                    <List>
                                        <ListItem>
                                            <Controller
                                                name="name"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="name"
                                                        label="Name"
                                                        error={Boolean(errors.name)}
                                                        helperText={errors.name ? 'Name is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="slug"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="slug"
                                                        label="Slug"
                                                        error={Boolean(errors.slug)}
                                                        helperText={errors.slug ? 'Slug is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="price"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="price"
                                                        label="Price"
                                                        error={Boolean(errors.price)}
                                                        helperText={errors.price ? 'Price is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            {getImageViewData && (
                                                <Image
                                                    loader={() => getImageViewData}
                                                    src={getImageViewData}
                                                    alt="Picture of the author"
                                                    width={300}
                                                    height={300}
                                                />
                                            )}
                                        </ListItem>
                                        <ListItem>
                                            <Button variant="contained" component="label">
                                                Upload File
                                                <input type="file" onChange={uploadHandler} hidden />
                                            </Button>
                                            {loadingUpload && <CircularProgress />}
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="category"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="category"
                                                        label="Category"
                                                        error={Boolean(errors.category)}
                                                        helperText={
                                                            errors.category ? 'Category is required' : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="brand"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="brand"
                                                        label="Brand"
                                                        error={Boolean(errors.brand)}
                                                        helperText={errors.brand ? 'Brand is required' : ''}
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="countInStock"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        id="countInStock"
                                                        label="Count in stock"
                                                        error={Boolean(errors.countInStock)}
                                                        helperText={
                                                            errors.countInStock
                                                                ? 'Count in stock is required'
                                                                : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>
                                        <ListItem>
                                            <Controller
                                                name="description"
                                                control={control}
                                                defaultValue=""
                                                rules={{
                                                    required: true,
                                                }}
                                                render={({ field }) => (
                                                    <TextField
                                                        variant="outlined"
                                                        fullWidth
                                                        multiline
                                                        id="description"
                                                        label="Description"
                                                        error={Boolean(errors.description)}
                                                        helperText={
                                                            errors.description
                                                                ? 'Description is required'
                                                                : ''
                                                        }
                                                        {...field}
                                                    ></TextField>
                                                )}
                                            ></Controller>
                                        </ListItem>

                                        <ListItem>
                                            <Button
                                                variant="contained"
                                                type="submit"
                                                fullWidth
                                                color="primary"
                                            >
                                                Update
                                            </Button>
                                            {loadingUpdate && <CircularProgress />}
                                        </ListItem>
                                    </List>
                                </form>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
}

export async function getServerSideProps({ params }) {
    return {
        props: { params },
    };
}

export default dynamic(() => Promise.resolve(ProductEdit), { ssr: false });