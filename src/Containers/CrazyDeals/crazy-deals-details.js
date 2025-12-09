import React, { useEffect, useState, useRef, useCallback, useContext } from 'react'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import { useParams } from 'react-router-dom';
import { ApiService } from '../../Components/services/apiServices';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import constants from '../../Components/services/constants';
import { toast } from 'react-toastify';
import DataContext from '../../Components/Elements/context';
import { showToast } from '../../Components/Elements/utils/toastUtils';
function CrazyDealsDetails() {
    const contextValues = useContext(DataContext);
    const { slug } = useParams();
    const didMountRef = useRef(true);
    const [crazyDealDetails, setCrazyDealDetails] = useState({})
    const [crazyDealsDetailProducts, setCrazyDealsProducts] = useState([])
    const [isLoader, setIsLoader] = useState(true);
    const getCrazyDealsDetail = useCallback(() => {
        ApiService.fetchData('crazyDealsDetail/' + slug).then(res => {
            if (res.status === 'success') {
                setCrazyDealDetails(res.crazyDealDetails)
                setCrazyDealsProducts(res.crazyDealProducts)
                setIsLoader(false)
            } else {
                setIsLoader(false)
            }
        })
    }, [])

    useEffect(() => {
        if (didMountRef.current) {
            getCrazyDealsDetail()
        }
        didMountRef.current = false
    }, [getCrazyDealsDetail])

    let formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const checkProductInCart = (product) => {
        const cartSession = JSON.parse(localStorage.getItem("CART_ITEM_BOX_SESSION") || "[]");
        return cartSession.some(cartItem =>
            cartItem.product_id === crazyDealDetails.product_id &&
            cartItem.product_selected_products.some(
                selected => selected.product_id === product.product_id
            )
        );
    };

    const checkItemCount = () => {
        let cart = JSON.parse(localStorage.getItem("CART_ITEM_BOX_SESSION") || "[]");

        const existingProductIndex = cart.findIndex(
            item => item.product_id === crazyDealDetails.product_id
        );
        if (existingProductIndex >= 0) {
            const totalselectedItems = cart[existingProductIndex].product_selected_products.length;
            if (totalselectedItems >= crazyDealDetails.product_moq) {
                return true;
            } else {
                return false
            }
        } else {
            return false;
        }

    };

    const addToBox = (product) => {
        let cart = JSON.parse(localStorage.getItem("CART_ITEM_BOX_SESSION") || "[]");

        const existingProductIndex = cart.findIndex(
            item => item.product_id === crazyDealDetails.product_id
        );

        const selectedProduct = {
            product_id: product.product_id,
            product_name: product.product_name,
            product_image: product.product_image || constants.DEFAULT_IMAGE,
            quantity: 1
        };

        if (existingProductIndex >= 0) {
            const totalselectedItems = cart[existingProductIndex].product_selected_products.length;
            if (totalselectedItems >= crazyDealDetails.product_moq) {
                toast.error("You can add maximum " + crazyDealDetails.product_moq + " items!",);
                return false;
            }
            const existingVariantIndex = cart[existingProductIndex]
                .product_selected_products.findIndex(
                    p => p.product_id === product.product_id
                );

            if (existingVariantIndex >= 0) {
                toast.error("This product is already in your box",);
                return;
            } else {
                cart[existingProductIndex].product_selected_products.push(selectedProduct);
            }
        } else {
            const newProduct = {
                product_id: Number(crazyDealDetails.product_id),
                product_name: crazyDealDetails.product_name,
                product_image: crazyDealDetails.product_image || constants.DEFAULT_IMAGE,
                product_type: Number(crazyDealDetails.product_type),
                product_price: Number(crazyDealDetails.product_price),
                product_selling_price: Number(crazyDealDetails.product_selling_price),
                product_discount: Number(crazyDealDetails.product_discount),
                product_category_name: crazyDealDetails.product_category_name,
                product_category_id: crazyDealDetails.product_category_id,
                product_moq: crazyDealDetails.product_moq,
                product_variation: [],
                product_selected_products: [selectedProduct],
                product_crazy_deal: 1,
                quantity: 1
            };
            cart.push(newProduct);
        }

        localStorage.setItem("CART_ITEM_BOX_SESSION", JSON.stringify(cart));
        getCrazyDealsDetail()
    };

    const removeFromBox = (product) => {
        let cart = JSON.parse(localStorage.getItem("CART_ITEM_BOX_SESSION") || "[]");

        const existingProductIndex = cart.findIndex(
            item => item.product_id === crazyDealDetails.product_id
        );

        if (existingProductIndex >= 0) {
            cart[existingProductIndex].product_selected_products = cart[existingProductIndex]
                .product_selected_products.filter(
                    p => p.product_id !== product.product_id
                );

            if (cart[existingProductIndex].product_selected_products.length === 0) {
                cart.splice(existingProductIndex, 1);
            }

            localStorage.setItem("CART_ITEM_BOX_SESSION", JSON.stringify(cart));
        }
        getCrazyDealsDetail()
    };

    const addToCartDeal = () => {
        if (localStorage.getItem("USER_SESSION")) {
            const productData = JSON.parse(localStorage.getItem("CART_ITEM_BOX_SESSION") || "[]")[0];
            ApiService.postData("plusToCartCrazyDeal", productData).then((res) => {
                if (res.status === "success") {
                    localStorage.removeItem("COUPON_SESSION");
                    localStorage.removeItem("CART_ITEM_BOX_SESSION");
                    toast.success(res.message);
                    getCrazyDealsDetail()
                    cartSessionData() 
                } else {
                    showToast('error', res.message, 1000);
                }
            });
        } else {
            const cartItem = JSON.parse(localStorage.getItem("CART_ITEM_BOX_SESSION") || "[]")[0];
            if (!cartItem) return;

            let cartSession = JSON.parse(localStorage.getItem("CART_SESSION") || "[]");

            const existingProductIndex = cartSession.findIndex((item) => {
                return (
                    item.product_id === cartItem.product_id &&
                    cartItem.product_crazy_deal === 1 &&
                    JSON.stringify(item.product_selected_products) === JSON.stringify(cartItem.product_selected_products)
                );
            });

            if (existingProductIndex !== -1) {
                cartSession[existingProductIndex].quantity += 1;
            } else {
                cartSession.push({ ...cartItem, quantity: 1 });
            }

            localStorage.setItem("CART_SESSION", JSON.stringify(cartSession));
            localStorage.removeItem("CART_ITEM_BOX_SESSION");

            cartSession = localStorage.getItem("CART_SESSION");
            cartSession = cartSession ? JSON.parse(cartSession) : [];
            contextValues.setCartSessionData(cartSession)
            contextValues.setcartCount(cartSession.length)
            contextValues.setCouponSession({})
            localStorage.removeItem("COUPON_SESSION");
            toast.success("Added to cart",);
            getCrazyDealsDetail()
        }

    };

    const cartSessionData = () => {
        const dataString = {
            coupon_session: localStorage.getItem("COUPON_SESSION"),
        };
        ApiService.postData("cartSessionData", dataString).then((res) => {
            if (res.data.status === "success") {
                contextValues.setCartSessionData(res.data.resCartData)
                contextValues.setcartCount(res.data.resCartData.length)
                contextValues.setCartSummary(res.data.cartSummary)
            }
        });
    }


    return (
        <>
            <Header />
            {isLoader ?
                <>
                    <div className='crazy-banner-section spaced-section spaced-section--full-width section-template--overlay'>
                        <Skeleton width="100%" height={210} />
                    </div>
                    <section className='crazy-deals-section-small bg-gray'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-lg-12'>
                                    <div className='text-center'>
                                        <h2><Skeleton width={350} height={50} /></h2>
                                        <div className='row bs-wizard mt-5 justify-content-center'>
                                            <div className='col-lg-3 col-4 bs-wizard-step  complete'>
                                                <div className="progress"><div className="progress-bar"></div></div>
                                                <a href="#" className="bs-wizard-dot"></a>
                                                <div className="bs-wizard-info text-center ">
                                                    <p className="mb-0"><Skeleton width={50} height={10} /></p>
                                                    <p className="mb-0 tx-12"><Skeleton width={100} height={10} /></p>
                                                </div>
                                            </div>
                                            <div className='col-lg-3 col-4 bs-wizard-step  complete'>
                                                <div className="progress"><div className="progress-bar"></div></div>
                                                <a href="#" className="bs-wizard-dot"></a>
                                                <div className="bs-wizard-info text-center ">
                                                    <p className="mb-0"><Skeleton width={50} height={10} /></p>
                                                    <p className="mb-0 tx-12"><Skeleton width={100} height={10} /></p>
                                                </div>
                                            </div>
                                            <div className='col-lg-3 col-4 bs-wizard-step  complete'>
                                                <div className="progress"><div className="progress-bar"></div></div>
                                                <a href="#" className="bs-wizard-dot"></a>
                                                <div className="bs-wizard-info text-center ">
                                                    <p className="mb-0"><Skeleton width={50} height={10} /></p>
                                                    <p className="mb-0 tx-12"><Skeleton width={100} height={10} /></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='crazy-deals-section'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-lg-3 col-6'>

                                </div>
                            </div>
                        </div>
                    </section>
                </>
                :
                <>
                    <div className='crazy-banner-section spaced-section spaced-section--full-width section-template--overlay'>
                        <div className='collection-banner mt-0'>
                            <div className='collection-banner__body color-background-4 overlay-enable show_img'>
                                <div className='container'>
                                    <div className='collection-banner__wrapper'>
                                        <div className='collection-banner__img'>
                                            <img src={crazyDealDetails.product_banner_image ? crazyDealDetails.product_banner_image : constants.DEFAULT_IMAGE} sizes="100vw" alt="Category Banner" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <section className='crazy-deals-section-small bg-gray'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-lg-12'>
                                    <div className='text-center'>
                                        <h2>{crazyDealDetails.product_name}</h2>
                                        <div className='row bs-wizard mt-5 justify-content-center'>
                                            <div className='col-lg-3 col-4 bs-wizard-step  complete'>
                                                <div className="progress"><div className="progress-bar"></div></div>
                                                <a href="#" className="bs-wizard-dot" onClick={(e) => e.preventDefault()}></a>
                                                <div className="bs-wizard-info text-center ">
                                                    <p className="mb-0">STEP 1</p>
                                                    <p className="mb-0 tx-12">Choose any {crazyDealDetails.product_moq} products</p>
                                                </div>
                                            </div>
                                            <div className='col-lg-3 col-4 bs-wizard-step  complete'>
                                                <div className="progress"><div className="progress-bar"></div></div>
                                                <a href="#" className="bs-wizard-dot" onClick={(e) => e.preventDefault()}></a>
                                                <div className="bs-wizard-info text-center ">
                                                    <p className="mb-0">STEP 2</p>
                                                    <p className="mb-0 tx-12">Add your bundle to the cart</p>
                                                </div>
                                            </div>
                                            <div className='col-lg-3 col-4 bs-wizard-step  complete'>
                                                <div className="progress"><div className="progress-bar"></div></div>
                                                <a href="#" className="bs-wizard-dot" onClick={(e) => e.preventDefault()}></a>
                                                <div className="bs-wizard-info text-center ">
                                                    <p className="mb-0">STEP 3</p>
                                                    <p className="mb-0 tx-12">Pay only ₹{crazyDealDetails.product_selling_price}/- on checkout</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {crazyDealsDetailProducts && crazyDealsDetailProducts.length > 0 ?
                        <section className='crazy-deals-section'>
                            <div class="container">
                                <div className='row justify-content-center'>
                                    {crazyDealsDetailProducts.map((value, index) => {
                                        const isInCart = checkProductInCart(value);
                                        return (
                                            <React.Fragment key={index}>
                                                <div className='col-lg-3 col-6'>
                                                    <div className="card-wrapper  js-color-swatches-wrapper">
                                                        <div className="card card--product" tabIndex={-1}>
                                                            <div className="card__inner full-unstyled-link">
                                                                <div className="media media--transparent media--portrait media--hover-effect" style={{ paddingBottom: "120%" }} >
                                                                    <img style={{ objectFit: "cover" }} src={value.product_image != null ? value.product_image : constants.DEFAULT_IMAGE} className="motion-reduce media--first" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="card-information">
                                                            <div className="card-information__wrapper">
                                                                <div className="caption-with-letter-spacing subtitle">
                                                                    {value.product_category_name}
                                                                </div>
                                                                <h3 className="card__title h5">
                                                                    <a className="full-unstyled-link" href={"#"} title={value.product_name} onClick={(e) => e.preventDefault()}>
                                                                        {value.product_name}
                                                                    </a>
                                                                </h3>
                                                                <div className="price  price--on-sale ">
                                                                    <dl>
                                                                        <div className="price__sale">
                                                                            <dd>
                                                                                <span className="price-item price-item--sale">
                                                                                    ₹{formatter.format(value.product_selling_price)}
                                                                                </span>
                                                                            </dd>
                                                                            {value.product_discount > 0 &&
                                                                                <dd className="price__compare">
                                                                                    <span className="price-item price-item--regular">
                                                                                        MRP. ₹{formatter.format(value.product_price)}
                                                                                    </span>
                                                                                </dd>
                                                                            }
                                                                        </div>
                                                                    </dl>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="product-form__checkout mt-5">
                                                            <button
                                                                className={`button ${isInCart ? 'button--primary' : 'button--primary'}`}
                                                                style={{ width: '100%' }}
                                                                onClick={() => isInCart ? removeFromBox(value) : addToBox(value)}
                                                                disabled={!isInCart && checkItemCount()}
                                                            >
                                                                {isInCart ? 'Remove Item' : 'Add To Box'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>
                        :
                        <section className='crazy-deals-section'>
                            <div className='container'>
                                <div className='row'>
                                    <div className='col-lg-12'>
                                        <div class="noimg">
                                            <img src="/img/empty-cart.webp" class="mb-3" alt="cart-image" />
                                            <h6>No Products Found!</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    }

                </>
            }
            <Footer />
            <div className='footer-sticky'>
                <div className='container'>
                    {isLoader ?
                        <div className='row align-items-center justify-content-center'>
                            <div className='col-auto sticky-addcart_img'>
                                <div className='sticky-addcart_image'>
                                    <Skeleton width={50} height={60} />
                                </div>
                            </div>
                            <div className='col col-sm-5 col-lg-4 col-xl-7 sticky-addcart_info'>
                                <h2 className="sticky-addcart_title"><Skeleton width={180} height={25} /></h2>
                                <div className="crazy-price">
                                    <ins className="new-price"><Skeleton width={80} height={15} /></ins>
                                    <del className="old-price"><Skeleton width={80} height={15} /></del>
                                </div>
                            </div>
                            <div className='col-auto sticky-addcart_actions'>
                                <Skeleton width={140} height={70} />
                            </div>
                        </div>
                        :
                        <div className='row align-items-center justify-content-center'>
                            <div className='col-auto sticky-addcart_img'>
                                <div className='sticky-addcart_image'>
                                    <img src={crazyDealDetails.product_image ? crazyDealDetails.product_image : constants.DEFAULT_IMAGE} />
                                </div>
                            </div>
                            <div className='col col-sm-5 col-lg-4 col-xl-7 sticky-addcart_info'>
                                <h2 className="sticky-addcart_title">{crazyDealDetails.product_name}</h2>
                                <div className="crazy-price">
                                    <ins className="new-price">₹{crazyDealDetails.product_selling_price}</ins>
                                    {crazyDealDetails.product_discount > 0 && <del className="old-price">₹{crazyDealDetails.product_price}</del>}
                                </div>
                            </div>
                            <div className='col-auto sticky-addcart_actions'>
                                <button type='text' className="button button--primary" disabled={!checkItemCount()} onClick={(e) => addToCartDeal()}>ADD TO CART</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </>

    )
}

export default CrazyDealsDetails