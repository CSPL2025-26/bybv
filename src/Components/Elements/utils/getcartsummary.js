    
const getcartsummary = (parsedCartSession) =>{
    // if(parsedCartSession && parsedCartSession.length>0){
    const couponSession = localStorage.getItem("COUPON_SESSION");
    const parsedCouponSession = couponSession ? JSON.parse(couponSession) : {discount_amount: 0.0,
      promo_id: 0,
      promo_code: "",
      cart_amount: 0.0,
    };
    const discountAmount = parsedCouponSession.discount_amount !== undefined && parsedCouponSession.discount_amount !== null && !isNaN(parsedCouponSession.discount_amount) && parsedCouponSession.discount_amount !== ''
    ? Number(parsedCouponSession.discount_amount)
    : 0;
  
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
  
      parsedCartSummary.total_amount = parseFloat(parsedCartSummary.itemTotal) - parseFloat(parsedCartSummary.discount) -  parseFloat(discountAmount);
      return parsedCartSummary;
//   }
}
  export default getcartsummary;
