/**
 * pages.config.js - Page routing configuration
 * 
 * This file is AUTO-GENERATED. Do not add imports or modify PAGES manually.
 * Pages are auto-registered when you create files in the ./pages/ folder.
 * 
 * THE ONLY EDITABLE VALUE: mainPage
 * This controls which page is the landing page (shown when users visit the app).
 * 
 * Example file structure:
 * 
 *   import HomePage from './pages/HomePage';
 *   import Dashboard from './pages/Dashboard';
 *   import Settings from './pages/Settings';
 *   
 *   export const PAGES = {
 *       "HomePage": HomePage,
 *       "Dashboard": Dashboard,
 *       "Settings": Settings,
 *   }
 *   
 *   export const pagesConfig = {
 *       mainPage: "HomePage",
 *       Pages: PAGES,
 *   };
 * 
 * Example with Layout (wraps all pages):
 *
 *   import Home from './pages/Home';
 *   import Settings from './pages/Settings';
 *   import __Layout from './Layout.jsx';
 *
 *   export const PAGES = {
 *       "Home": Home,
 *       "Settings": Settings,
 *   }
 *
 *   export const pagesConfig = {
 *       mainPage: "Home",
 *       Pages: PAGES,
 *       Layout: __Layout,
 *   };
 *
 * To change the main page from HomePage to Dashboard, use find_replace:
 *   Old: mainPage: "HomePage",
 *   New: mainPage: "Dashboard",
 *
 * The mainPage value must match a key in the PAGES object exactly.
 */
import AccessDenied from './pages/AccessDenied';
import AppEntry from './pages/AppEntry';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Deliveries from './pages/Deliveries';
import DeliveryDetail from './pages/DeliveryDetail';
import EmailVerification from './pages/EmailVerification';
import ExceptionDetail from './pages/ExceptionDetail';
import Exceptions from './pages/Exceptions';
import Finance from './pages/Finance';
import Help from './pages/Help';
import Landing from './pages/Landing';
import Notifications from './pages/Notifications';
import OnboardingConfirm from './pages/OnboardingConfirm';
import OnboardingRole from './pages/OnboardingRole';
import OnboardingVessel from './pages/OnboardingVessel';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderDetail from './pages/OrderDetail';
import Orders from './pages/Orders';
import PasswordReset from './pages/PasswordReset';
import PoolDetail from './pages/PoolDetail';
import Pools from './pages/Pools';
import Privacy from './pages/Privacy';
import Products from './pages/Products';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Shop from './pages/Shop';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import SystemHealth from './pages/SystemHealth';
import Terms from './pages/Terms';
import UsersVessels from './pages/UsersVessels';
import VendorDetail from './pages/VendorDetail';
import VendorOrderDetail from './pages/VendorOrderDetail';
import VendorOrders from './pages/VendorOrders';
import Vendors from './pages/Vendors';
import AdminCategories from './pages/AdminCategories';
import Categories from './pages/Categories';
import CategoryCollection from './pages/CategoryCollection';
import __Layout from './Layout.jsx';


export const PAGES = {
    "AccessDenied": AccessDenied,
    "AppEntry": AppEntry,
    "Cart": Cart,
    "Checkout": Checkout,
    "Contact": Contact,
    "Dashboard": Dashboard,
    "Deliveries": Deliveries,
    "DeliveryDetail": DeliveryDetail,
    "EmailVerification": EmailVerification,
    "ExceptionDetail": ExceptionDetail,
    "Exceptions": Exceptions,
    "Finance": Finance,
    "Help": Help,
    "Landing": Landing,
    "Notifications": Notifications,
    "OnboardingConfirm": OnboardingConfirm,
    "OnboardingRole": OnboardingRole,
    "OnboardingVessel": OnboardingVessel,
    "OrderConfirmation": OrderConfirmation,
    "OrderDetail": OrderDetail,
    "Orders": Orders,
    "PasswordReset": PasswordReset,
    "PoolDetail": PoolDetail,
    "Pools": Pools,
    "Privacy": Privacy,
    "Products": Products,
    "Reports": Reports,
    "Settings": Settings,
    "Shop": Shop,
    "SuperAdminDashboard": SuperAdminDashboard,
    "SystemHealth": SystemHealth,
    "Terms": Terms,
    "UsersVessels": UsersVessels,
    "VendorDetail": VendorDetail,
    "VendorOrderDetail": VendorOrderDetail,
    "VendorOrders": VendorOrders,
    "Vendors": Vendors,
    "AdminCategories": AdminCategories,
    "Categories": Categories,
    "CategoryCollection": CategoryCollection,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};