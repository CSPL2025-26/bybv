import ReactPixel from '../services/FacebookPixel';

const trackPageView = () => {
    ReactPixel.pageView(); // Tracks page views
};

const trackAddToCart = (cartSession) => {
    const contents = cartSession.map(item => ({
        id: String(item.product_id),
        quantity: item.quantity,
        item_price: item.product_selling_price
    }));
    const contentIds = cartSession.map(item => String(item.product_id).replace(/"/g, ''));

    ReactPixel.track('AddToCart', {
        content_ids: contentIds,
        content_type: 'product',
        contents: contents,
        currency: 'INR',
        value: contents.reduce((total, item) => total + (item.item_price * item.quantity), 0)
    });
};

const ViewCart = (cartSession) => {
    const contents = cartSession.map(item => ({
        id: String(item.product_id),
        quantity: item.quantity,
        item_price: item.product_selling_price
    }));
    const contentIds = cartSession.map(item => String(item.product_id).replace(/"/g, ''));

    ReactPixel.track('ViewCart', {
        content_ids: contentIds,
        content_type: 'product',
        contents: contents,
        currency: 'INR',
        value: contents.reduce((total, item) => total + (item.item_price * item.quantity), 0)
    });
};

const trackInitiateCheckout = (cartSession) => {

    if(localStorage.getItem('USER_SESSION')){
        const contents = cartSession.map(item => ({
            id: String(item.cart_product_id),
            quantity: item.cart_qty,
            item_price: item.cart_prod_sellingprice
        })); 
        const uniqueProductCategoryIds = Array.from(new Set(cartSession.map(item => item?.product?.product_category_id.split(',')))).flat();
        const contentIds = cartSession.map(item => String(item.cart_product_id).replace(/"/g, ''));
        ReactPixel.track('InitiateCheckout', {
            content_category: uniqueProductCategoryIds,
            content_ids: contentIds,
            contents: contents,
            currency: 'INR',
            num_items: contents.reduce((total, item) => total + item.quantity, 0),
            value: contents.reduce((total, item) => total + (item.item_price * item.quantity), 0),
          });
    }else{
    const contents = cartSession.map(item => ({
        id: String(item.product_id),
        quantity: item.quantity,
        item_price: item.product_selling_price
    })); 
    const uniqueProductCategoryIds = Array.from(new Set(cartSession.map(item => item.product_category_id.split(',')))).flat();
    const contentIds = cartSession.map(item => String(item.product_id).replace(/"/g, ''));
    ReactPixel.track('InitiateCheckout', {
        content_category: uniqueProductCategoryIds,
        content_ids: contentIds,
        contents: contents,
        currency: 'INR',
        num_items: contents.reduce((total, item) => total + item.quantity, 0),
        value: contents.reduce((total, item) => total + (item.item_price * item.quantity), 0),
      });
    }
};

const trackCompleteRegistration = (value, currency = 'USD') => {
    ReactPixel.track('CompleteRegistration', {
        value: value,
        currency: currency,
    });
};

const trackPurchase = (cartSession) => {
    const contents = cartSession.map(item => ({
        id: String(item.product_id),
        quantity: item.quantity,
        item_price: item.product_selling_price
    })); 
    ReactPixel.track('Purchase', {
      contents: cartSession.map(item => String(item.product_id)),
      currency: 'INR',
      value: contents.reduce((total, item) => total + (item.item_price * item.quantity), 0),
    });
  };

export { trackPageView, trackAddToCart, trackCompleteRegistration, trackInitiateCheckout, trackPurchase, ViewCart};