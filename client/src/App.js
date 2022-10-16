import { Routes, Route, Outlet } from "react-router-dom";

import { UserProvider } from "./contexts/UserContext";

import "./App.css";

import Header from "./components/App/Header";

import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

import SupplierHome from "./components/SupplierDashboard/SupplierHome";
import SupplierAddProduct from "./components/SupplierDashboard/SupplierAddProduct";
import SupplierManageProduct from "./components/SupplierDashboard/SupplierManageProduct";
import SupplierShipProduct from "./components/SupplierDashboard/SupplierShipProduct";
import { ProductProvider } from "./contexts/ProductContext";
import ScanProduct from "./components/DistributorRetailerConsumerDashboard/ScanProduct";

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="auth">
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Route>
            <Route path="1" element={<Outlet />}>
              <Route path="" element={<SupplierHome />} />
              <Route path="add" element={<SupplierAddProduct />} />
              <Route path="manage" element={<SupplierManageProduct />} />
              <Route path="ship" element={<SupplierShipProduct />} />
            </Route>
            <Route path="2" element={<Outlet />}>
              <Route path="scan" element={<ScanProduct />} />
            </Route>
            <Route path="3" element={<Outlet />}>
              <Route path="scan" element={<ScanProduct />} />
            </Route>
            <Route path="4" element={<Outlet />}>
              <Route path="scan" element={<ScanProduct />} />
            </Route>
          </Routes>
        </div>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;
