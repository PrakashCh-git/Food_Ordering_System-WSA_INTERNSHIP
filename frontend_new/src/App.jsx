import React, { useEffect } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loadUser } from './redux/action/userActions'
import { getCart } from './redux/action/cartActions'
import Home from './Components/Home'
import Header from './Components/layout/Header'
import Footer from './Components/layout/Footer'
import Menu from './Components/Menu'
import Login from './Components/Login'
import Register from './Components/Register'
import ForgotPassword from './Components/ForgotPassword'
import Profile from './Components/Profile'
import Cart from './Components/Cart'
import PaymentSuccess from './Components/PaymentSuccess'
import MyOrders from './Components/MyOrders'
import Reviews from './Components/Reviews'
import AdminRoute from './Components/AdminRoute'
import AdminDashboard from './Components/admin/AdminDashboard'
import AdminFoodItems from './Components/admin/AdminFoodItems'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(loadUser())
    dispatch(getCart())
  }, [])
  return (
    <Router>
      <div className='App'>
        <Header />
        <div className='container container-fluid'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path="/eats/stores/search/:keyword" element={<Home />} />
            <Route path="/eats/stores/:id/menus" element={<Menu />} />
            <Route path="/users/login" element={<Login />} />
            <Route path="/users/register" element={<Register />} />
            <Route path="/users/forgotPassword" element={<ForgotPassword />} />
            <Route path="/users/me" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/eats/orders/me/myOrders" element={<MyOrders />} />
            <Route path="/eats/stores/:id/reviews" element={<Reviews />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/restaurants/:restaurantId/fooditems" element={<AdminRoute><AdminFoodItems /></AdminRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App
