import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './Containers/Home';
import Login from './Containers/Login';
import Register from './Containers/Register';
import Collections from './Containers/Collections';
import CollectionsDetail from './Containers/CollectionsDetail';
import Cart from './Containers/Cart';
import Account from './Containers/Account/account';
import Orders from './Containers/Account/orders';
import Address from './Containers/Account/address';
import Checkout from './Containers/Cart/checkout';
import Blog from './Containers/Blogs';
import BlogDetails from './Containers/BlogDetails';
import Pages from './Containers/Pages';
import About from './Containers/About';
import Contact from './Containers/Contact';
import Certifications from './Containers/Certifications';
import Forgotpassword from './Containers/ForgotPassword';
import ResetPassword from "./Containers/ResetPassword"
import CartAddress from './Containers/Cart/address';
import Thankyou from './Containers/Cart/thankyou';
import Orderdetail from './Containers/Order-detail';
import Error404 from './Containers/Error/error_404';
import Helpsupport from './Containers/Account/help-support';
import LabReports from './Containers/LabReports';
import CancelPayment from './Containers/Cart/cancel-payment';
import DeleteAccount from './Containers/DeleteAccount'; 
import CrazyDealsDetails from './Containers/CrazyDeals/crazy-deals-details';
import CrazyDeals from './Containers/CrazyDeals/crazy-deals';
function App() {
  return (
    <div className="App">
      <ToastContainer />
       <Router>
        <Routes>
          <Route exact path='/' activeClassName="active" element={<Home />} />
          <Route exact path='/account' activeClassName="active" element={<Account />} />
          <Route exact path='/orders' activeClassName="active" element={<Orders />} />
          <Route exact path='/address' activeClassName="active" element={<Address />} />
          {/* CART */}
          
          <Route exact path='/cart' activeClassName="active" element={<Cart />} />
          <Route exact path='/cart-address' activeClassName="active" element={<CartAddress />} />
          <Route exact path='/checkout' activeClassName="active" element={<Checkout />} />
          <Route exact path='/thankyou/:id' activeClassName="active" element={<Thankyou />} />
          {/*  */}
          <Route exact path='/about-us' activeClassName="active" element={<About/>} />
          <Route exact path='/help-support' activeClassName="active" element={<Helpsupport/>} />
          <Route exact path='/contact' activeClassName="active" element={<Contact/>} />
          <Route exact path='/delete-account' activeClassName="active" element={<DeleteAccount/>} />
          <Route exact path='/certifications' activeClassName="active" element={<Certifications/>} />
          <Route exact path='/blogs' activeClassName="active" element={<Blog />} />
          <Route exact path='/blogs/:slug' activeClassName="active" element={<BlogDetails />} />
          {/* <Route exact path='/login' activeClassName="active" element={<Login />} /> */}
          {/* <Route exact path='/register' activeClassName="active" element={<Register />} /> */}
          {/* <Route exact path='/forgot-password' activeClassName="active" element={<Forgotpassword />} /> */}
          {/* <Route exact path='/collections' activeClassName="active" element={<Collections />} /> */}
          <Route exact path='/collections/:type/:slug' activeClassName="active" element={<Collections />} />
          <Route exact path='/collections/:type' activeClassName="active" element={<Collections />} />
          <Route exact path='/lab-reports' activeClassName="active" element={<LabReports/>} />
          <Route exact path='/cancel-payment' activeClassName="active" element={<CancelPayment/>} />

          <Route exact path='/crazy-deals' activeClassName="active" element={<CrazyDeals/>} />
          <Route exact path='/crazy-deals-detail/:slug?' activeClassName="active" element={<CrazyDealsDetails/>} />



          <Route exact path='/resetpasswordlink' activeClassName="active" element={<ResetPassword />} />

          <Route exact path='/products/:slug' activeClassName="active" element={<CollectionsDetail />} />
          <Route exact path='/order-detail/:id' activeClassName="active" element={<Orderdetail />} />
          <Route exact path='/:slug' activeClassName="active" element={<Pages/>} />
          <Route exact path='/error_404' activeClassName="active" element={<Error404/>} />
          <Route path="*" element={<Error404 />} />





        </Routes>
      </Router>
    </div>
  );
}

export default App;
