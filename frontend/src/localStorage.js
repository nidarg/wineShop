export const getCartItems =()=>{
  const cartItems = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')):[]
  return cartItems
} 

export const setCartItems = (cartItems)=>{
  localStorage.setItem('cartItems', JSON.stringify(cartItems))
}

export const setUserInfo = ({
  _id='',
  name='',
  email='',
  password='',
  token='',
  isAdmin=false
})=>{
  localStorage.setItem('userInfo', JSON.stringify({_id, name, email, password, token, isAdmin}))
}

export const getUserInfo = ()=>{
  return localStorage.getItem('userInfo')? JSON.parse(localStorage.getItem('userInfo')):{_id:'',name:'', email:'',password:'',token:'',isAdmin:false}
}

export const removeUserFromLocalStorage = ()=>{
  localStorage.removeItem('userInfo')
}

// export const getReview = ()=>{
//   return localStorage.getItem('review')?JSON.parse(localStorage.getItem('review')):{addReview:false,productId:''}
// }

// export const setReview = ({addReview=false, productId=''})=>{localStorage.setItem('review', JSON.stringify({addReview, productId}))}

export const getShipping = ()=>{
  const shipping = localStorage.getItem('shipping') ?
    JSON.parse(localStorage.getItem('shipping')) :
    {
      address:'',
      city:'',
      country:'',
      postalCode:''

    }
    return shipping
}

export const setShipping = ({
  address='',
  city='',
  postalCode='',
  country='',
  
})=>{
  localStorage.setItem('shipping', JSON.stringify({address, city,postalCode, country}))
}




export const getPayment = ()=>{
  const payment = localStorage.getItem('payment') ?
    JSON.parse(localStorage.getItem('payment')) :
    {
      paymentMethod:'paypal'

    }
    return payment
}

export const setPayment = ({
  paymentMethod='paypal'
})=>{
  localStorage.setItem('payment', JSON.stringify({paymentMethod}))
}

export const cleanCart = ()=>{
  localStorage.removeItem('cartItems')
}