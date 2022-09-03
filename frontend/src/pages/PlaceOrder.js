import { getCartItems,getShipping,getPayment, cleanCart } from "../localStorage"
import CheckoutSteps from "../components/CheckoutSteps"
import { showLoading, hideLoading, showMessage } from "../utils"
import { createOrder } from "../api"

const convertCartToOrder = ()=>{
  const orderItems = getCartItems()
  if(orderItems.length === 0){
    document.location.hash = '/cart'
  }

  const shipping = getShipping()
  if(!shipping){
    document.location.hash = '/shipping'
  }

  const payment = getPayment()
  if(!payment){
    document.location.hash = '/payment'
  }

  const itemsPrice = orderItems.reduce((a,c)=> a + c.price * c.qty,0)
  const shippingPrice = itemsPrice > 100 ? 0 : 10
  const totalPrice = itemsPrice + shippingPrice
  
  return{
    orderItems,shipping,payment,itemsPrice,shippingPrice,totalPrice
  }
}

const PlaceOrder = {

  after_render:async ()=>{
    document.getElementById('placeorder-button').addEventListener('click',async()=>{
      const order = convertCartToOrder()
      showLoading()
      const data = await createOrder(order)
      hideLoading()
      if(data.error){
        showMessage(data.error)
      }else{
        cleanCart()
        document.location.hash = `/order/${data.order._id}`
      }
      })
    
  },

  render:()=>{
    const { orderItems,shipping,payment,itemsPrice,shippingPrice,totalPrice} = convertCartToOrder()

    return `
    
    <div>
      ${CheckoutSteps.render({
        step1:true,step2:true,step3:true,step4:true
      })}

      <div class='order'>
        <div class='order-info'>
          <div>
            <h2>Shipping</h2>
            <div>
            ${shipping.address}, ${shipping.city}, ${shipping.postalCode},
             ${shipping.country}
            </div>
          </div>

          <div>
            <h2>Payment</h2>
            <div>Payment Method : ${payment.paymentMethod}</div> 
          </div>

          <div>
            <ul class='cart-list-container'>
              <li>
                <h2>Shopping Cart</h2>
                <div>Price </div>
              </li>
              ${orderItems.map((item)=>
                `
                <li>
                  <div class='cart-image'>
                    <img src='${item.image}' alt='${item.name}'/>
                  </div>
                  <div class='cart-name'>
                    <a href='/#/product/${item.productId}'>${item.name}</a>
                    <div>Qty : ${item.qty} </div>
                  </div>
                 <div class='cart-price'>${item.price} E </div>
                </li>
                `
                )}
              
            </ul>
          </div>
        </div>

        <div class='order-action'>
          <ul>
            <li>
              <h2>Order Summary</h2>
          </li>
          <li><div>Items</div><div>${itemsPrice} E</div></li>
          <li><div>Shipping</div><div>${shippingPrice} E</div></li>
          <li class='total'><div>Order Totals</div><div>${totalPrice} E</div></li>
          <li><button id='placeorder-button' class='primary fw'>Place Order</button></li>
          </ul>
        </div>
      </div>
    </div>
    
    `
  }
}

export default PlaceOrder