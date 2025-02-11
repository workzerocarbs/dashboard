/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  createBrowserRouter,
} from "react-router-dom";
import "../src/App.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Header from "./components/header/Header";
import Sidebar from "./components/sidebar/Sidebar";
import useLocalStorage from "./hooks/useLocalStorage";
import CategoryList from "./pages/menu/category/CategoryList";
import AddItem from "./pages/menu/item/AddItem";
import AddOn from "./pages/menu/add-on/AddOn";
import ViewAll from "./pages/menu/viewAll/ViewAll";
import ViewExpenses from "./pages/expenses/view-expenses/ViewExpenses";
import AddNew from "./pages/expenses/add-new/AddNew";
import Notifications from "./pages/notifications/Notifications";
import Orders from "./pages/orders/new-orders/Orders";
import OrderHistory from "./pages/orders/order-history/OrderHistory";
import Coupons from "./pages/coupons/Coupons";
import Login from "./pages/login/Login";
import Promo from "./pages/promo-code/Promo";
import { PusherProvider, usePusher } from "./context/PusherContext";

import axios from "axios";
import OrderModal from "./pages/orders/orders-modal/OrderModal";
import AppLayout from "./components/app_layout/AppLayout";
import { useReceivedOrder } from "./context/ReceivedOrderContext";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [theme, setTheme] = useLocalStorage("theme", "dark");
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const pusher = usePusher(); // Get the Pusher instance from context
  const { toggleNotificationModal, handleUpdateReceivedOrderedItems } =
    useReceivedOrder(); // Get the state's and setter's for received orders

  // Effect to subscribe to order notifications when Pusher is available
  useEffect(
    function () {
      // if (!pusher) {
      //   console.error("Pusher instance is not available.");
      //   return;
      // }

      const channel = pusher?.subscribe("order-notifications-channel");

      channel?.bind("order-notification-event", async (data) => {
        // console?.log("New order notification:", data);
        const resOrderDetails = await axios.get(
          `https://api.zerocarbs.in/api/web/order/get/${data?.data?.order_id}`
        );
        // console.log(resOrderDetails?.data);
        const resultData = resOrderDetails?.data?.data;
        handleUpdateReceivedOrderedItems(resultData);
      });

      return () => {
        if (channel) {
          channel.unbind_all();
          pusher.unsubscribe("order-notifications-channel");
        }
      };
    },
    [pusher, handleUpdateReceivedOrderedItems]
  );

  // Login
  const onLogin = (status) => {
    setIsAuthenticated(status);
  };

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Close on Mobile
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    // Update body background color based on the selected theme
    document.body.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route
          path="*"
          element={
            isAuthenticated ? (
              <>
                {/* FIXME */}
                {toggleNotificationModal && <OrderModal />}
                <Header
                  toggleSidebar={toggleSidebar}
                  isSidebarOpen={isSidebarOpen}
                  toggleTheme={toggleTheme}
                  theme={theme}
                />
                <div
                  className={`main ${
                    isSidebarOpen ? "sidebar-open" : "sidebar-closed"
                  }`}
                >
                  <div className="sidebarWrapper">
                    <Sidebar
                      isSidebarOpen={isSidebarOpen}
                      closeSidebar={closeSidebar}
                    />
                  </div>
                  <div className="content">
                    <Routes>
                      <Route
                        path="/"
                        exact
                        element={<Navigate to="/dashboard" />}
                      />
                      <Route path="/dashboard" exact element={<Dashboard />} />
                      <Route
                        path="/menu/category"
                        exact
                        element={<CategoryList />}
                      />
                      <Route
                        path="/menu/category/:id"
                        exact
                        element={<CategoryList />}
                      />
                      <Route path="/menu/item" exact element={<AddItem />} />
                      <Route
                        path="/menu/add-on-group"
                        exact
                        element={<AddOn />}
                      />
                      <Route
                        path="/menu/view-menu"
                        exact
                        element={<ViewAll />}
                      />
                      <Route
                        path="/menu/view-menu/:id"
                        exact
                        element={<ViewAll />}
                      />
                      <Route
                        path="/orders/new-orders"
                        exact
                        element={<Orders />}
                      />
                      <Route
                        path="/orders/order-history"
                        exact
                        element={<OrderHistory />}
                      />
                      <Route
                        path="/expenses/add-new"
                        exact
                        element={<AddNew />}
                      />
                      <Route
                        path="/expenses/view-expenses"
                        exact
                        element={<ViewExpenses />}
                      />
                      <Route path="/coupons" exact element={<Coupons />} />
                      <Route path="/coupons/:id" exact element={<Coupons />} />
                      <Route path="/promo-code" exact element={<Promo />} />
                      <Route
                        path="/notifications"
                        exact
                        element={<Notifications />}
                      />
                    </Routes>
                  </div>
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
