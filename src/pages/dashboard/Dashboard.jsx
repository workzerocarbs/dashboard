/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "../dashboard/style.scss";
import DashboardBox from "./components/DashboardBox";
import { IoFastFoodSharp } from "react-icons/io5";
import { BiSolidFoodMenu } from "react-icons/bi";
import { BsThreeDots } from "react-icons/bs";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaRupeeSign } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useReceivedOrder } from "../../context/ReceivedOrderContext";

const ITEM_HEIGHT = 45;

const Dashboard = () => {
  const { receivedOrderedItems } = useReceivedOrder();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [todaysOrdersCount, setTodaysOrdersCount] = useState([]);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = () => {
    navigate("/orders/new-orders");
  };

  useEffect(() => {
    document.title = "ZeroCarbs | Dashboard";
  }, []);

  // Fetches the count of "New" orders (order_status=1) on initial load
  useEffect(() => {
    (async function () {
      try {
        const res = await fetch(
          "https://api.zerocarbs.in/api/order?order_status=1",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        const data = await res.json();
        setTodaysOrdersCount(data?.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setTodaysOrdersCount([]); // Avoid undefined state
      }
    })();
  }, [receivedOrderedItems]);

  // Comparing dates from receivedOrderedItems's objects
  const todayOrders = todaysOrdersCount?.filter((order) => {
    const orderDate = new Date(order?.created_at); // Convert string to Date object

    // Convert to IST (Indian Standard Time)
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
    const localOrderDate = new Date(orderDate.getTime() + istOffset);

    // Get today's date in IST
    const today = new Date();
    const localToday = new Date(today.getTime() + istOffset);

    return (
      localOrderDate.getFullYear() === localToday.getFullYear() &&
      localOrderDate.getMonth() === localToday.getMonth() &&
      localOrderDate.getDate() === localToday.getDate()
    );
  }).length;

  // console.log("todayOrders", todayOrders);

  return (
    <>
      <div className="container-fluid body-content w-100">
        <div className="card border-0 p-3">
          <h3 className="mb-0">Dashboard</h3>
        </div>
        <div className="new-order alert alert-primary" onClick={handleNavigate}>
          <h3 className="text-red-200">
            <span>{`(${todayOrders}) `}</span>
            <span>
              New {`${todayOrders > 1 ? "Orders " : "Order "}`} Received
            </span>
          </h3>
        </div>
        <div className="row dashboardBoxWrapperRow">
          <div className="col-md-8">
            <div className="dashboardBoxWrapper">
              <DashboardBox
                title="Total Users"
                color={["#1da256", "#48d483"]}
                icon={<IoFastFoodSharp />}
                grow={true}
              />

              <DashboardBox
                title="Total Orders"
                color={["#c012e2", "#eb64fe"]}
                icon={<BiSolidFoodMenu />}
              />

              <DashboardBox
                title="Total Items"
                color={["#2c78e5", "#60aff5"]}
                icon={<BiSolidFoodMenu />}
              />

              <DashboardBox
                title="Total Reviews"
                color={["#e1950e", "#f3cd29"]}
                icon={<BiSolidFoodMenu />}
              />
            </div>
          </div>

          <div className="col-md-4 ps-0">
            <div className="box graphBox">
              <div className="d-flex align-items-center w-100">
                <h6>Total Revenue</h6>
                <div className="ms-auto">
                  <Button className="toggleIcon" onClick={handleClick}>
                    <BsThreeDots />
                  </Button>
                  <Menu
                    id="long-menu"
                    MenuListProps={{
                      "aria-labelledby": "long-button",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: "20ch",
                      },
                    }}
                  >
                    <MenuItem onClick={handleClose}>
                      <FaClockRotateLeft size={15} />
                      <p>Last Day</p>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <FaClockRotateLeft size={15} />
                      <p>Last Week</p>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <FaClockRotateLeft size={15} />
                      <p>Last Month</p>
                    </MenuItem>
                    <MenuItem onClick={handleClose}>
                      <FaClockRotateLeft size={15} />
                      <p>Last Year</p>
                    </MenuItem>
                  </Menu>
                </div>
              </div>

              <h3>
                <FaRupeeSign />
                69,69,699.69
              </h3>
              <p className="">
                <FaRupeeSign />
                69,000 in last month
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
