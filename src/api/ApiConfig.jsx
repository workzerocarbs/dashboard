import axios from "axios";

// Base URL of the API
export const base_url = "https://api.zerocarbs.in/api";

// Base url for image
export const imageUrl = "https://api.zerocarbs.in/";

// Auth Token
export const token = localStorage.getItem("authToken");

const apiClient = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});

export const endpoints = {
  // Login
  login: "/authenticate",
  logout: "/logout",

  // Menu Category
  getCategory: "/menu/category",
  getCategoryById: (id) => `/menu/category/${id}`,
  addCategory: "/menu/category",
  updateCategory: (id) => `/menu/category/${id}`,
  deleteCategoryById: (id) => `/menu/category/${id}`,

  // Menu Item
  addMenuItem: "/menu/item",
  updateMenuItemById: (id) => `/menu/item/${id}`,
  deleteMenuItemById: (id) => `/menu/item/${id}`,
  getMenuItem: "/menu/item",
  getMenuItemById: (id) => `/menu/item/${id}`,
  getMenuItemsByTypeAndCategory: (type, category_id) => {
    return type === "all"
      ? `/menu/item?category_id=${category_id}`
      : `/menu/item?&type=${type}&category_id=${category_id}`;
  },

  toggleMenuItemStock: (id, action = "toggle-stock") =>
    `/menu/item/${id}/${action}`,
  addNutrition: "/menu/nutrition",
  deleteNutritionById: (id) => `/menu/nutrition/${id}`,

  //Add on
  createAddOn: "/menu/addon/create",
  getAllAddOns: "/menu/addon",
  addAddOnToItem: "/menu/addon/add",

  // Discount Coupon
  addCoupon: "/coupon",
  getCoupon: "/coupon",
  getCouponsById: (id) => `/coupon/${id}`,
  getActiveCouponsFilter: (status = "active") => `/coupon?status=${status}`,
  toggleCouponStatus: (id, action = "toggle-status") =>
    `/coupon/${action}/${id}`,

  // Order Related
  getOrder: "/order",
  getOrderByStatus: (order_status) => `/order?order_status=${order_status}`,
  updateOrderStatus: (id, action = "status") => `/order/${id}/${action}`,
  updateOrderPaymentStatus: (id, action = "payment-status") =>
    `/order/${id}/${action}`,

  //Promoc Related
  getPromoCode: "/promocode",
  addPromoCode: "/promocode",
  togglePromodCodeStatus: (id, action = "toggle-status") =>
    `/promocode/${action}/${id}`,

  //Notification Related
  getNoificationList: "/notification",

  getNotifcationByStatus: (type) => `/notification?status=${type}`,
  getNotificationById: (id) => `/notification/${id}`,
  addNotification: "/notification",
  changeNotificationStatus: "/notification/mark-read",

  // fetching menu from the frontend
  getAllMenu : "/web/menu/get"
};

export default apiClient;
