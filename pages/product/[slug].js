import React, { useContext, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Image from 'next/image';
import {
    Grid,
    Link,
    List,
    ListItem,
    Typography,
    Card,
    Button,
    CircularProgress,
    TextField,
} from '@material-ui/core';
// import { useRouter } from 'next/router';
// import data from '../../utils/data';
import Layout from '../../components/Layout';
import useStyles from '../../utils/styles';
import client from '../../graphql/apollo-client';
import { getOneProduct } from '../../graphql/schema/product/get-one-product';
import { updateUserReview } from '../../graphql/schema/product/review/update-user-review';
import { Store } from '../../utils/Store';
import { checkStockOneProduct } from '../../graphql/schema/product/check-stock-one-product';
import { useRouter } from 'next/router';
import { Rating } from '@material-ui/lab';
import { useSnackbar } from 'notistack';
import { getProductManyReviewById } from '../../graphql/schema/product/review/get-product-many-review-by-id';

export default function ProductScreen(props) {
    const router = useRouter();
    const { state, dispatch } = useContext(Store);
    const { userInfo } = state;
    const { product } = props;
    const classes = useStyles();
    const { enqueueSnackbar } = useSnackbar();

    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await client.query({
                query: updateUserReview,
                variables: {
                    updateUserReviewId: product._id,
                    rating: rating,
                    comment: comment
                }
            });
            setLoading(false);
            enqueueSnackbar('Review submitted successfully', { variant: 'success' });
            fetchReviews();
        } catch (err) {
            setLoading(false);
            enqueueSnackbar("There's an error", { variant: 'error' });
        }
    };

    const isoStringToString = (isoDate) => {
        console.log("dating")
        console.log(isoDate)
        let date = new Date(isoDate);
        console.log(date)
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return year + '-' + month + '-' + dt
    }

    const fetchReviews = async () => {
        try {
            const { data } = await client.query({
                query: getProductManyReviewById,
                variables: {
                    getProductManyReviewByIdId: product._id
                }
            });
            setReviews(data.getProductManyReviewById);
        } catch (err) {
            enqueueSnackbar("There's an error", { variant: 'error' });
        }
    };
    useEffect(() => {
        fetchReviews();
    }, []);
    // const router = useRouter();
    // const { slug } = router.query;
    // const product = data.products.find((a) => a.slug === slug);
    if (!product) {
        return <div>Product Not Found</div>;
    }
    const addToCartHandler = async () => {
        const existItem = state.cart.cartItems.find((x) => x._id === product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        const { data } = await client.query({
            query: checkStockOneProduct,
            variables: {
                checkStockOneProductId: product._id,
                quantity: quantity
            }
        });
        if (!data.checkStockOneProduct) {
            window.alert('Sorry. Product is out of stock');
            return;
        }
        dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
        router.push('/cart');
    };

    return (
        <Layout title={product.name} description={product.description}>
            <div className={classes.section}>
                <NextLink href="/" passHref>
                    <Link>
                        <Typography>back to products</Typography>
                    </Link>
                </NextLink>
            </div>
            <Grid container spacing={1}>
                <Grid item md={6} xs={12}>
                    <Image
                        loader={() => product.image}
                        src={product.image}
                        alt={product.name}
                        width={640}
                        height={640}
                        layout="responsive"
                    ></Image>
                </Grid>
                <Grid item md={3} xs={12}>
                    <List>
                        <ListItem>
                            <Typography component="h1" variant="h1">
                                {product.name}
                            </Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>Category: {product.category}</Typography>
                        </ListItem>
                        <ListItem>
                            <Typography>Brand: {product.brand}</Typography>
                        </ListItem>
                        <ListItem>
                            <Rating value={product.rating} readOnly></Rating>
                            <Link href="#reviews">
                                <Typography>({product.numReviews} reviews)</Typography>
                            </Link>
                        </ListItem>
                        <ListItem>
                            <Typography> Description: {product.description}</Typography>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item md={3} xs={12}>
                    <Card>
                        <List>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Price</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>${product.price}</Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Grid container>
                                    <Grid item xs={6}>
                                        <Typography>Status</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography>
                                            {product.countInStock > 0 ? 'In stock' : 'Unavailable'}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </ListItem>
                            <ListItem>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    onClick={addToCartHandler}
                                >
                                    Add to cart
                                </Button>
                            </ListItem>
                        </List>
                    </Card>
                </Grid>
            </Grid>
            <List>
                <ListItem>
                    <Typography name="reviews" id="reviews" variant="h2">
                        Customer Reviews
                    </Typography>
                </ListItem>
                {reviews.length === 0 && <ListItem>No review</ListItem>}
                {reviews.map((review) => (
                    <ListItem key={review._id}>
                        <Grid container>
                            <Grid item className={classes.reviewItem}>
                                <Typography>
                                    <strong>{review.name}</strong>
                                </Typography>
                                <Typography>{isoStringToString(review.createdAt)}</Typography>
                            </Grid>
                            <Grid item>
                                <Rating value={review.rating} readOnly></Rating>
                                <Typography>{review.comment}</Typography>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
                <ListItem>
                    {userInfo ? (
                        <form onSubmit={submitHandler} className={classes.reviewForm}>
                            <List>
                                <ListItem>
                                    <Typography variant="h2">Leave your review</Typography>
                                </ListItem>
                                <ListItem>
                                    <TextField
                                        multiline
                                        variant="outlined"
                                        fullWidth
                                        name="review"
                                        label="Enter comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                </ListItem>
                                <ListItem>
                                    <Rating
                                        name="simple-controlled"
                                        value={rating}
                                        onChange={(e) => setRating(e.target.value)}
                                    />
                                </ListItem>
                                <ListItem>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="primary"
                                    >
                                        Submit
                                    </Button>

                                    {loading && <CircularProgress></CircularProgress>}
                                </ListItem>
                            </List>
                        </form>
                    ) : (
                        <Typography variant="h2">
                            Please{' '}
                            <Link href={`/login?redirect=/product/${product.slug}`}>
                                login
                            </Link>{' '}
                            to write a review
                        </Typography>
                    )}
                </ListItem>
            </List>
        </Layout>
    );
}

export async function getServerSideProps(context) {
    const { params } = context;
    const { slug } = params;

    const { data } = await client.query({
        query: getOneProduct,
        variables: {
            slug: slug,
        }
    });

    return {
        props: {
            product: data.getOneProduct,
        },
    };
}