import HomePage from './pages/HomePage.js'
import ProductPage from './pages/ProductPage.js'
import CartPage from './pages/CartPage.js'
import SigninPage from './pages/SigninPage.js'
import RegisterPage from './pages/RegisterPage.js'
import ProfilePage from './pages/ProfilePage.js'
import ShippingPage from './pages/ShippingPage.js'
import PaymentPage from './pages/PaymentPage.js'
import PlaceOrder from './pages/PlaceOrder.js'
import OrderPage from './pages/OrderPage.js'
import DashboardPage from './pages/DashboardPage.js'
import ProductListPage from './pages/ProductListPage.js'
import ProductEditPage from './pages/ProductEditPage.js'
import OrderListPage from './pages/OrderListPage.js'
import { parseRequestUrl } from './utils.js'
import Error404Page from './pages/Error404Page.js'
import Header from './components/Header.js'
import { showLoading, hideLoading } from "./utils"

const routes = {
    '/':HomePage,
    '/product/:id/edit':ProductEditPage,
    '/product/:id': ProductPage,
    '/order/:id': OrderPage,
    '/cart/:id':CartPage,
    '/cart':CartPage,
    '/signin':SigninPage,
    '/register':RegisterPage,
    '/profile':ProfilePage,
    '/shipping':ShippingPage,
    '/payment':PaymentPage,
    '/placeorder':PlaceOrder,
    '/dashboard':DashboardPage,
    '/productlist':ProductListPage,
    '/orderlist':OrderListPage,
}

const router= async ()=>{
    showLoading()
    const request = parseRequestUrl()
    const parseUrl = (request.resource ? `/${request.resource}` : '/') + 
        (request.id ? `/:id` : '') + 
        (request.action ? `/${request.action}` : '')
   
    const page = routes[parseUrl] ? routes[parseUrl] : Error404Page
    
    const header = document.getElementById('header-container')
    header.innerHTML = await Header.render()
    await Header.after_render()
    
    const main = document.getElementById('main-container')
    main.innerHTML = await page.render()
   
    if(page.after_render){await page.after_render()}
    hideLoading()
}

window.addEventListener('load', router)
window.addEventListener('hashchange', router)