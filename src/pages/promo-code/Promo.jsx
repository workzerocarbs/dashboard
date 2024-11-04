/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import '../promo-code/style.scss';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { GoDotFill } from "react-icons/go";
import { addNewPromoCode, getAllPromoCode, togglePrmoCodeStatus } from '../../utils/PromoCodeAPI';

const Promo = () => {
    const [showForm, setShowForm] = useState(false);
    const [showCoupons, setShowCoupons] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    const [coupons, setCoupons] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        discount: '',
        discount_type: '1',
        description: '',
        min_order_value: ''
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const handleForm = () => {
        setShowForm(true);
        setShowCoupons(false);
    };

    const handleTrackOffers = () => {
        setShowForm(false);
        setShowCoupons(true);
        setActiveTab('active');
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        console.log(name)
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleStatusChange = (coupon) => {
        setSelectedCoupon(coupon);
        setOpenDialog(true);
    };

    const handleFormSubmit = async(e) => {
        e.preventDefault();
        const { title, discount,    discount_type, description, min_order_value } = formData;
            console.log(formData)
        if (title.trim() === '' || discount.trim() === '' || description.trim() === '' || min_order_value.trim() === '') {
            alert('All fields are required.');
            return;
        }
        const convertedFormData = {
            ...formData,
            discount: parseInt(discount, 10),        // Convert discount to an integer
            discount_type: parseInt(discount_type, 10),  // Convert discount_type to an integer
        };
        try {
            const response = await addNewPromoCode(convertedFormData);
            console.log('Response:', response);
            toast.success("Form has been submitted successfully!");
            const newCoupon = {
                ...response.data,
                status: 'active',
                formattedDiscount: discount_type == '1' ? `${discount}%` : `₹${discount}`
            };
            setCoupons([...coupons, newCoupon]);
            setFormData({
                title: '',
                discount: '',
                discount_type: '1',
                min_order_value: '',
                description: '',
            });
            setShowForm(false);
            setShowCoupons(true);
            setActiveTab('active');
        } catch (err) {
            console.log('Err', err.response?.data || err.message);
            toast.error("Error submitting the form. Please try again.");
        }
        
       
      
      
    };

    const confirmStatusChange = async() => {
        const toggledStatus = await togglePrmoCodeStatus(selectedCoupon.id);
        const updatedCoupons = coupons.map(coupon => {
            if (coupon.id === selectedCoupon.id) {
                return {
                    ...coupon,
                    status: coupon.status === 'active' ? 'inactive' : 'active'
                };
            }
            return coupon;
        });
        setCoupons(updatedCoupons);
        setOpenDialog(false);
        setActiveTab(selectedCoupon.status === 'active' ? 'inactive' : 'active');
    };

    useEffect(() => {
        document.title = "ZeroCarbs | Promo Offers";

        const fetchCoupons = async () => {
            try {
                const response = await  getAllPromoCode()
                console.log(response)
                const processedPromoCode = response.data.map(coupon => ({
                    ...coupon,
                    status: coupon.status === 1 ? 'active' : 'inactive',
                    formattedDiscount: coupon.discount_type == '1'
                        ? `${coupon.discount}%`
                        : `₹${coupon.discount}`
                }));
                setCoupons(processedPromoCode);
            } catch (error) {
                console.error('Error fetching coupons:', error);
            }
        };

        fetchCoupons();
    }, []);

    const filteredCoupons = coupons.filter(coupon => {
        console.log(coupon.status)
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return coupon.status === 'active';
        if (activeTab === 'inactive') return coupon.status === 'inactive';
        return true;
    });

    const activeCount = coupons.filter(coupon => coupon.status === 'active').length;
    console.log("activecount", activeCount)
    const inactiveCount = coupons.filter(coupon => coupon.status === 'inactive').length;
    const allCount = coupons.length;
    return (
        <div className='body-content'>
            <div className="card border-0 p-3">
                <h3 className="mb-0">Promo Offers</h3>
            </div>
            <div className="border-0">
                <div className="card-body">
                    <div className="add-promo">
                        <Button onClick={handleTrackOffers} className={showCoupons ? 'active' : ''}>Track Offers</Button>
                        <Button onClick={handleForm} className={showForm ? 'active' : ''}>Create Offers</Button>
                    </div>
                    <div className="promo-list">
                        {showForm && (
                            <div className="promo-form">
                                <form onSubmit={handleFormSubmit}>
                                    <div className="form-content">
                                        <div>
                                            <label>Title</label>
                                            <input type="text" name="title" placeholder='Promo Title' value={formData.title} onChange={handleFormChange} />
                                        </div>
                                        <div>
                                            <label>Discount</label>
                                            <input type="number" name="discount" placeholder='Promo Discount' value={formData.discount} onChange={handleFormChange} />
                                        </div>
                                        <div>
                                            <label>Discount Type:</label>
                                            <select
                                                className="form-select"
                                                name="discount_type"
                                                value={formData.discount_type}
                                                onChange={handleFormChange}>
                                                <option value="1">Percentage</option>
                                                <option value="2">Fixed Amount</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label>Min-order Value</label>
                                            <select className="form-select" name='min_order_value' value={formData.min_order_value} onChange={handleFormChange}>
                                                <option defaultValue>Orders above</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='textbox'>
                                        <label>Description</label>
                                        <textarea name="description" placeholder='Promo Description' value={formData.description} onChange={handleFormChange}></textarea>
                                    </div>
                                    <Button type="submit">Submit</Button>
                                </form>
                            </div>
                        )}
                        {showCoupons && (
                            <>
                                <div className="tabs">
                                    <Button onClick={() => handleTabChange('active')} className={activeTab === 'active' ? 'active' : ''}>Active <span>({activeCount})</span></Button>
                                    <Button onClick={() => handleTabChange('inactive')} className={activeTab === 'inactive' ? 'active' : ''}>Inactive <span>({inactiveCount})</span></Button>
                                    <Button onClick={() => handleTabChange('all')} className={activeTab === 'all' ? 'active' : ''}>All <span>({allCount})</span></Button>
                                </div>
                                <ul className='promo-container'>
                                    {activeTab === 'active' && activeCount === 0 && (
                                        <p>No active offers</p>
                                    )}
                                    {activeTab === 'inactive' && inactiveCount === 0 && (
                                        <p>No inactive offers</p>
                                    )}
                                    {filteredCoupons.map((coupon, index) => (
                                        <li key={coupon.id} className='promo-body'>
                                            <div className="leftbox">
                                                <div className="content">
                                                    <div className="heading">
                                                        <h1>{coupon.title}</h1>
                                                        <span className={coupon.status === 'active' ? 'active' : 'inactive'}>{coupon.status}</span>
                                                    </div>
                                                    <div className="body">
                                                        <p>{coupon.desc}</p>
                                                        <p><GoDotFill size={10} /> Minimum Order Value: {coupon.minOrderValue}</p>
                                                    </div>
                                                    <Button onClick={() => handleStatusChange(coupon)}>
                                                        {coupon.status === 'active' ? 'Stop Offer' : 'Start Offer'}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className={`rightBox rightBox-${index % 5}`}>
                                                <div className="content">
                                                    <h4>{coupon.discount}% OFF</h4>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">
                    {`Are you sure you want to ${selectedCoupon?.status === 'active' ? 'stop' : 'start'} this offer?`}
                </DialogTitle>
                <DialogContent>
                    <h2 className='dialog-headding'>{selectedCoupon?.title}</h2>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        No
                    </Button>
                    <Button onClick={confirmStatusChange} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default Promo