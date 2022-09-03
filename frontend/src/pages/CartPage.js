
import { parseRequestUrl } from "../utils"
import { getProduct } from "../api"
import { getCartItems } from "../localStorage"
import { setCartItems } from "../localStorage"
import { rerender } from "../utils"


const addToCart = (item, forceUpdate=false) =>{
  // get cart items from local storage
  let cartItems = getCartItems()
  //verify if item you want to add to cart exists
  const existItem = cartItems.find(x=>x.productId === item.productId)
  if(existItem){
    if(forceUpdate){
      cartItems = cartItems.map(x=>x.productId === existItem.productId ? item : x
      )
    }
    
  }else{
    cartItems = [...cartItems, item]
  }
  setCartItems(cartItems)

  if(forceUpdate){
    rerender(CartPage)
  }
 
}

const removeFromCart = (id)=>{
  setCartItems(getCartItems().filter(x=>x.productId !== id))
  // if deleted product id === with req params id change Url to '/cart' otherwise rerender page
  if(id ===  parseRequestUrl().id){
    document.location.hash = '/cart'
  }else{
    rerender(CartPage)
  }
}

const CartPage = {
  after_render:()=>{
    //handle select options
    const qtySelects = document.getElementsByClassName('qty-select')
    // make array from options and foreach option add event listener
    Array.from(qtySelects).forEach(qtySelect=>{
      qtySelect.addEventListener('change',(e)=>{
        const item = getCartItems().find(x=>x.productId === qtySelect.id)
        // add to cart updated item
        // because forceUpdate is true addToCart cal rerender method(see utils.js)
        addToCart({...item, qty:Number(e.target.value)},true)
      })
    })

    // handle click on delete buttons

    const deleteButtons = document.getElementsByClassName('delete-button')
    Array.from(deleteButtons).forEach(deleteButton=>{
      deleteButton.addEventListener('click',()=>{
        removeFromCart(deleteButton.id)
      })
    })
    document.getElementById('checkout-button').addEventListener('click',()=>{
      document.location.hash = '/signin'
    })
  },

  
  render: async()=>{

    const request = parseRequestUrl()
    // if request.id means that user clicked on Add to cart button
    if(request.id){
      const product = await getProduct(request.id)
      addToCart({
        productId:product._id,
        name:product.name,
        image:product.image,
        price:product.price,
        countInStock:product.countInStock,
        qty:1
      })
    }
   
    const cartItems = getCartItems()
    return `
      <div class='content cart'>
        <div class='cart-list'>
          <ul class='cart-list-container'>
            <li>
              <h3>Shopping Cart</h3>
              <div>Price</div>
            </li>
            ${cartItems.length === 0 ?
            '<div>Cart is empty. <a href="/#/">Go to main page</a></div>':
            cartItems.map(item=>
              `
              <li>
              <div class="cart-image">
                <img src="${item.image}" alt="${item.name}" />
              </div>
              <div class="cart-name">
                <div>
                  <a href="/#/product/${item.productId}">
                    ${item.name}
                  </a>
                </div>
                <div>
                  Qty: 
                  <select class="qty-select" id="${item.productId}">
                  ${[...Array(item.countInStock).keys()].map((x) =>
                    item.qty === x + 1
                      ? `<option selected value="${x + 1}">${x + 1}</option>`
                      : `<option  value="${x + 1}">${x + 1}</option>`
                  )}  
                  </select>
                  <button type="button" class="delete-button" id="${
                    item.productId
                  }">
                    Delete
                  </button>
                </div>
              </div>
              <div class="cart-price">
                ${item.price} E
              </div>
            </li>
            `
            )
                  .join('\n')
            }
          </ul>
        </div>

        <div class="cart-action">
          <h3>
            Subtotal (${cartItems.reduce((a, c) => a + c.qty, 0)} items)
            :
            ${cartItems.reduce((a, c) => a + c.price * c.qty, 0)} E
          </h3>
          <button id="checkout-button" class="primary fw">
            Proceed to Checkout
          </button>
      </div>
      </div>
    `

  }
}

export default CartPage