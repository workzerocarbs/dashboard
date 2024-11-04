import veg from '/veg.svg';
import nonVeg from '/non-veg.svg';

export const initialOrders = [
    {
        orderStatus: "Delivered",
        id: 1747,
        name: "Rishav Saha",
        phone: "9706679317",
        address: "rishavsaha199@gmail.com",
        items: [
            {
                image: veg,
                quantity: 1,
                description: "Grilled Paneer Sandwich",
                price: 349.00,
            },
            {
                image: veg,
                quantity: 2,
                description: "Veggie Burger",
                price: 199.00,
            }
        ],
        request: "please don't use tomato",
        status: "New",
        payment: "paid",
        timer: 5,
        initialTimer: 5,
    },
    {
        orderStatus: "Delivered",
        id: 1799,
        name: "Rishav Saha",
        phone: "9706679317",
        address: "rishavsaha199@gmail.com",
        items: [
            {
                image: nonVeg,
                quantity: 1,
                description: "Chicken Sandwich",
                price: 349.00,
            },
            {
                image: nonVeg,
                quantity: 2,
                description: "Chicken Burger",
                price: 299.00,
            }
        ],
        request: "please don't use tomato",
        status: "New",
        payment: "unpaid",
        timer: 900,
        initialTimer: 900,
    },
]