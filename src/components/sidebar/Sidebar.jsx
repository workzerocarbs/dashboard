/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import "../sidebar/style.scss";
import Button from "@mui/material/Button";
import { FaHome, FaAngleRight, FaAngleUp, FaBell } from "react-icons/fa";
import { MdMenuBook, MdDeliveryDining } from "react-icons/md";
import { RiMoneyRupeeCircleFill, RiDiscountPercentFill } from "react-icons/ri";
import { BiSolidDiscount } from "react-icons/bi";

const Sidebar = ({ isSidebarOpen, closeSidebar }) => {
  const location = useLocation();

  const determineActiveTabAndSubmenu = (pathname) => {
    const basePath = pathname.split("/").slice(0, 3).join("/");
    switch (basePath) {
      case "/dashboard":
        return { tab: 0, submenu: null };
      case "/menu/category":
        return { tab: 1, submenu: 1 };
      case "/menu/item":
        return { tab: 1, submenu: 2 };
      case "/menu/add-on-group":
        return { tab: 1, submenu: 3 };
      case "/menu/view-menu":
        return { tab: 1, submenu: 4 };
      case "/orders/new-orders":
        return { tab: 2, submenu: 1 };
      case "/orders/order-history":
        return { tab: 2, submenu: 2 };
      case "/expenses/view-expenses":
        return { tab: 3, submenu: 1 };
      case "/expenses/add-new":
        return { tab: 3, submenu: 2 };
      case "/coupons":
        return { tab: 4, submenu: null };
      case "/promo-code":
        return { tab: 5, submenu: null };
      case "/notifications":
        return { tab: 6, submenu: null };
      default:
        return { tab: 0, submenu: null };
    }
  };

  const initialStates = determineActiveTabAndSubmenu(location.pathname);
  const [activeTab, setActiveTab] = useState(initialStates.tab);
  const [openSubmenu, setOpenSubmenu] = useState(
    initialStates.tab !== null ? initialStates.tab : null
  );
  const [activeSubmenuItems, setActiveSubmenuItems] = useState({
    [initialStates.tab]: initialStates.submenu,
  });
  const [submenuTopPosition, setSubmenuTopPosition] = useState({});
  const liRefs = useRef([]);

  const isMobile = () => window.innerWidth <= 768;

  useEffect(() => {
    if (!isSidebarOpen) {
      setOpenSubmenu(null);
    }
  }, [isSidebarOpen]);

  useEffect(() => {
    const newStates = determineActiveTabAndSubmenu(location.pathname);
    setActiveTab(newStates.tab);
    setOpenSubmenu(newStates.tab !== null ? newStates.tab : null);
    setActiveSubmenuItems({ [newStates.tab]: newStates.submenu });
  }, [location.pathname]);

  const handleTabClick = (index, hasSubmenu) => {
    setActiveTab(index);

    if (hasSubmenu) {
      if (openSubmenu === index) {
        setOpenSubmenu(null);
      } else {
        setOpenSubmenu(index);
        if (liRefs.current[index]) {
          const { top } = liRefs.current[index].getBoundingClientRect();
          const sidebarTop =
            liRefs.current[0].parentElement.getBoundingClientRect().top;
          setSubmenuTopPosition((prev) => ({
            ...prev,
            [index]: top - sidebarTop,
          }));
        }
      }
    } else {
      setOpenSubmenu(null);
      if (isMobile()) closeSidebar();
    }
  };

  const handleSubmenuClick = (tabIndex, submenuIndex) => {
    setActiveSubmenuItems((prev) => ({
      ...prev,
      [tabIndex]: submenuIndex,
    }));

    // if (!isSidebarOpen) {
    //     setOpenSubmenu(null);
    // }

    if (isMobile()) {
      setOpenSubmenu(null);
      closeSidebar();
    }
  };

  const handleMouseLeave = () => {
    setOpenSubmenu(null);
  };

  return (
    <div className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
      <ul>
        <li ref={(el) => (liRefs.current[0] = el)}>
          <Link to="/dashboard">
            <Button
              className={`w-100 ${activeTab === 0 ? "active" : ""}`}
              onClick={() => handleTabClick(0, false)}
            >
              <span className="icon">
                <FaHome size={22} />
              </span>
              {isSidebarOpen && <p>Dashboard</p>}
              {isSidebarOpen && (
                <span className="arrow">
                  <FaAngleRight size={18} />
                </span>
              )}
            </Button>
          </Link>
        </li>
        <li ref={(el) => (liRefs.current[1] = el)}>
          <Button
            className={`w-100 ${activeTab === 1 ? "active" : ""}`}
            onClick={() => handleTabClick(1, true)}
          >
            <span className="icon">
              <MdMenuBook size={22} />
            </span>
            {isSidebarOpen && <p>Menu</p>}
            {isSidebarOpen && (
              <span className="arrow">
                {openSubmenu === 1 ? (
                  <FaAngleUp size={18} />
                ) : (
                  <FaAngleRight size={18} />
                )}
              </span>
            )}
          </Button>
          {isSidebarOpen ? (
            <div
              className={`submenuWrapper ${
                openSubmenu === 1 ? "colapse" : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Link
                    to="/menu/category"
                    className={`w-100 ${
                      activeSubmenuItems[1] === 1 ? "active-submenu" : ""
                    }`}
                    onClick={() => handleSubmenuClick(1, 1)}
                  >
                    Categories List
                  </Link>
                </li>
                <li>
                  <Link
                    to="/menu/item"
                    className={`w-100 ${
                      activeSubmenuItems[1] === 2 ? "active-submenu" : ""
                    }`}
                    onClick={() => handleSubmenuClick(1, 2)}
                  >
                    Add New
                  </Link>
                </li>
                <li>
                  <Link
                    to="/menu/add-on-group"
                    className={`w-100 ${
                      activeSubmenuItems[1] === 3 ? "active-submenu" : ""
                    }`}
                    onClick={() => handleSubmenuClick(1, 3)}
                  >
                    Add on Group
                  </Link>
                </li>
                <li>
                  <Link
                    to="/menu/view-menu"
                    className={`w-100 ${
                      activeSubmenuItems[1] === 4 ? "active-submenu" : ""
                    }`}
                    onClick={() => handleSubmenuClick(1, 4)}
                  >
                    View Menu
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            openSubmenu === 1 && (
              <div
                className="submenu-popup"
                onMouseLeave={handleMouseLeave}
                style={{ top: `${submenuTopPosition[1]}px` }}
              >
                <ul className="submenu">
                  <li>
                    <Link
                      to="/menu/category"
                      className={`w-100 ${
                        activeSubmenuItems[1] === 1 ? "active-submenu" : ""
                      }`}
                      onClick={() => handleSubmenuClick(1, 1)}
                    >
                      Categories List
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/menu/item"
                      className={`w-100 ${
                        activeSubmenuItems[1] === 2 ? "active-submenu" : ""
                      }`}
                      onClick={() => handleSubmenuClick(1, 2)}
                    >
                      Add New
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/menu/add-on-group"
                      className={`w-100 ${
                        activeSubmenuItems[1] === 3 ? "active-submenu" : ""
                      }`}
                      onClick={() => handleSubmenuClick(1, 3)}
                    >
                      Add on Group
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/menu/view-menu"
                      className={`w-100 ${
                        activeSubmenuItems[1] === 4 ? "active-submenu" : ""
                      }`}
                      onClick={() => handleSubmenuClick(1, 4)}
                    >
                      View Menu
                    </Link>
                  </li>
                </ul>
              </div>
            )
          )}
        </li>
        <li ref={(el) => (liRefs.current[2] = el)}>
          <Button
            className={`w-100 ${activeTab === 2 ? "active" : ""}`}
            onClick={() => handleTabClick(2, true)}
          >
            <span className="icon">
              <MdDeliveryDining size={22} />
            </span>
            {isSidebarOpen && <p>Orders</p>}
            {isSidebarOpen && (
              <span className="arrow">
                {openSubmenu === 2 ? (
                  <FaAngleUp size={18} />
                ) : (
                  <FaAngleRight size={18} />
                )}
              </span>
            )}
          </Button>
          {isSidebarOpen ? (
            <div
              className={`submenuWrapper ${
                openSubmenu === 2 ? "colapse" : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Link
                    to="/orders/new-orders"
                    className={`w-100 ${
                      activeSubmenuItems[2] === 1 ? "active-submenu" : ""
                    }`}
                    onClick={() => handleSubmenuClick(2, 1)}
                  >
                    New Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orders/order-history"
                    className={`w-100 ${
                      activeSubmenuItems[2] === 2 ? "active-submenu" : ""
                    }`}
                    onClick={() => handleSubmenuClick(2, 2)}
                  >
                    Order History
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            openSubmenu === 2 && (
              <div
                className="submenu-popup"
                onMouseLeave={handleMouseLeave}
                style={{ top: `${submenuTopPosition[2]}px` }}
              >
                <ul className="submenu">
                  <li>
                    <Link
                      to="/orders/new-orders"
                      className={`w-100 ${
                        activeSubmenuItems[2] === 1 ? "active-submenu" : ""
                      }`}
                      onClick={() => handleSubmenuClick(2, 1)}
                    >
                      New Orders
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orders/order-history"
                      className={`w-100 ${
                        activeSubmenuItems[2] === 2 ? "active-submenu" : ""
                      }`}
                      onClick={() => handleSubmenuClick(2, 2)}
                    >
                      Order History
                    </Link>
                  </li>
                </ul>
              </div>
            )
          )}
        </li>
        <li ref={(el) => (liRefs.current[3] = el)}>
          <Button
            className={`w-100 ${activeTab === 3 ? "active" : ""}`}
            onClick={() => handleTabClick(3, true)}
          >
            <span className="icon">
              <RiMoneyRupeeCircleFill size={22} />
            </span>
            {isSidebarOpen && <p>Expenses</p>}
            {isSidebarOpen && (
              <span className="arrow">
                {openSubmenu === 3 ? (
                  <FaAngleUp size={18} />
                ) : (
                  <FaAngleRight size={18} />
                )}
              </span>
            )}
          </Button>
          {isSidebarOpen ? (
            <div
              className={`submenuWrapper ${
                openSubmenu === 3 ? "colapse" : "colapsed"
              }`}
            >
              <ul className="submenu">
                <li>
                  <Link
                    to="/expenses/view-expenses"
                    className={`w-100 ${
                      activeSubmenuItems[3] === 1 ? "active-submenu" : ""
                    }`}
                    onClick={() => handleSubmenuClick(3, 1)}
                  >
                    View Expenses
                  </Link>
                </li>
                <li>
                  <Link
                    to="/expenses/add-new"
                    className={`w-100 ${
                      activeSubmenuItems[3] === 2 ? "active-submenu" : ""
                    }`}
                    onClick={() => handleSubmenuClick(3, 2)}
                  >
                    Add New
                  </Link>
                </li>
              </ul>
            </div>
          ) : (
            openSubmenu === 3 && (
              <div
                className="submenu-popup"
                onMouseLeave={handleMouseLeave}
                style={{ top: `${submenuTopPosition[3]}px` }}
              >
                <ul className="submenu">
                  <li>
                    <Link
                      to="/expenses/view-expenses"
                      className={`w-100 ${
                        activeSubmenuItems[3] === 1 ? "active-submenu" : ""
                      }`}
                      onClick={() => handleSubmenuClick(3, 1)}
                    >
                      View Expenses
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/expenses/add-new"
                      className={`w-100 ${
                        activeSubmenuItems[3] === 2 ? "active-submenu" : ""
                      }`}
                      onClick={() => handleSubmenuClick(3, 2)}
                    >
                      Add New
                    </Link>
                  </li>
                </ul>
              </div>
            )
          )}
        </li>
        <li ref={(el) => (liRefs.current[4] = el)}>
          <Link to="/coupons">
            <Button
              className={`w-100 ${activeTab === 4 ? "active" : ""}`}
              onClick={() => handleTabClick(4, false)}
            >
              <span className="icon">
                <BiSolidDiscount size={22} />
              </span>
              {isSidebarOpen && <p>Coupons</p>}
              {isSidebarOpen && (
                <span className="arrow">
                  <FaAngleRight size={18} />
                </span>
              )}
            </Button>
          </Link>
        </li>
        <li ref={(el) => (liRefs.current[5] = el)}>
          <Link to="/promo-code">
            <Button
              className={`w-100 ${activeTab === 5 ? "active" : ""}`}
              onClick={() => handleTabClick(5, false)}
            >
              <span className="icon">
                <RiDiscountPercentFill size={22} />
              </span>
              {isSidebarOpen && <p>Promo Offers</p>}
              {isSidebarOpen && (
                <span className="arrow">
                  <FaAngleRight size={18} />
                </span>
              )}
            </Button>
          </Link>
        </li>
        <li ref={(el) => (liRefs.current[6] = el)}>
          <Link to="/notifications">
            <Button
              className={`w-100 ${activeTab === 6 ? "active" : ""}`}
              onClick={() => handleTabClick(6, false)}
            >
              <span className="icon">
                <FaBell size={22} />
              </span>
              {isSidebarOpen && <p>Notifications</p>}
              {isSidebarOpen && (
                <span className="arrow">
                  <FaAngleRight size={18} />
                </span>
              )}
            </Button>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
