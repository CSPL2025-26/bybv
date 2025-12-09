const localStorageData = () => {
    const addressSession = localStorage.getItem("ADDRESS_SESSION");
    const parsedAddressSession = addressSession ? JSON.parse(addressSession) : {};
  
    const couponSession = localStorage.getItem("COUPON_SESSION");
    const parsedCouponSession = couponSession ? JSON.parse(couponSession) : {discount_amount: 0.0,
      promo_id: 0,
      promo_code: "",
      cart_amount: 0.0,
    };
    
    const discountAmount = parsedCouponSession.discount_amount !== undefined && parsedCouponSession.discount_amount !== null && !isNaN(parsedCouponSession.discount_amount) && parsedCouponSession.discount_amount !== ''
    ? Number(parsedCouponSession.discount_amount)
    : 0;

    const cartSession = localStorage.getItem("CART_SESSION");
    const parsedCartSession = cartSession ? JSON.parse(cartSession) : [];
    
    const parsedCartSummary = {
      itemTotal: 0,
      discount: 0,
      total_amount: 0,
      shipping_charge: 0,
      sellingTotal: 0,
    };
    parsedCartSummary.itemTotal = parsedCartSession.reduce((total, cartItem) => {
      const price = parseFloat(cartItem.product_price) || 0;
      const quantity = Number(cartItem.quantity) || 0;
      return total + price * quantity;
    }, 0);
    
    parsedCartSummary.discount = parsedCartSession.reduce((total, cartItem) => {
      const price = parseFloat(cartItem.product_price) || 0;
      const sellingPrice = parseFloat(cartItem.product_selling_price) || 0;
      const quantity = Number(cartItem.quantity) || 0;
      return total + (price - sellingPrice) * quantity;
    }, 0);
    
    parsedCartSummary.sellingTotal = parsedCartSession.reduce((total, cartItem) => {
      const sellingPrice = parseFloat(cartItem.product_selling_price) || 0;
      const quantity = Number(cartItem.quantity) || 0;
      return total + sellingPrice * quantity;
    }, 0);

    /* parsedCartSession.forEach((value) => {
      parsedCartSummary.itemTotal += Number(value.product_price) * Number(value.quantity)
      parsedCartSummary.discount += Number(value.product_discount) * Number(value.quantity)
      parsedCartSummary.total_amount += Number(value.product_selling_price) * Number(value.quantity)
    }); */

    parsedCartSummary.total_amount = parseFloat(parsedCartSummary.itemTotal) - parseFloat(parsedCartSummary.discount) -  parseFloat(discountAmount);
  
    const recentlyProductsSession = localStorage.getItem("RECENTLY_VIEWED");
    const parsedRecentlyProductsSession = recentlyProductsSession ? JSON.parse(recentlyProductsSession) : [];
  
    const userSessionData = localStorage.getItem("USER_SESSION");
    const parsedUserSession = userSessionData ? JSON.parse(userSessionData) : null;

    const cartDealSession = localStorage.getItem("CART_DEAL_BOX_SESSION");
    const parsedCartDealSession = cartDealSession ? JSON.parse(cartDealSession) : [];


    const dataArr = [];
    dataArr['AddressSession'] = parsedAddressSession;
    dataArr['CartSession'] = parsedCartSession;
    dataArr['CouponSession'] = parsedCouponSession;
    dataArr['CartSummary'] = parsedCartSummary;
    dataArr['RecentlyProductsSession'] = parsedRecentlyProductsSession;
    dataArr['UserSession'] = parsedUserSession;
    dataArr['CartDealSession'] = parsedCartDealSession;
  
    return dataArr;
  };
  
  export default localStorageData;
  