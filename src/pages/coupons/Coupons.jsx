/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import '../coupons/style.scss';
import { toast, ToastContainer } from 'react-toastify';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { GoDotFill } from "react-icons/go";
import { addNewCoupon, getAllCoupon, getCouponById, toggleCouponStatus } from '../../utils/CouponsAPI';
import { useParams } from 'react-router-dom';

const Coupons = () => {
    const [showForm, setShowForm] = useState(false);
    const [showCoupons, setShowCoupons] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    const [coupons, setCoupons] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        discount: '',
        discount_type: '1',
        min_order_value: '',
        description: '',
    });
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        document.title = "ZeroCarbs | Coupons";

        // Fetch coupons
        const fetchCoupons = async () => {
            try {
                const fetchedCoupons = await getAllCoupon();
                const processedCoupons = fetchedCoupons.data.map(coupon => ({
                    ...coupon,
                    status: coupon.status === 1 ? 'active' : 'inactive',
                    formattedDiscount: coupon.discount_type == '1'
                        ? `${coupon.discount}%`
                        : `₹${coupon.discount}`
                }));
                setCoupons(processedCoupons);
            } catch (error) {
                console.error('Error fetching coupons:', error);
            }
        };

        // Fetch coupons by ID
        const loadCouponById = async (id) => {
            try {
                const coupon = await getCouponById(id);
                // Access the nested data object
                const processedCoupon = {
                    ...coupon.data,
                    status: coupon.data.status === 1 ? 'active' : 'inactive',
                    formattedDiscount: coupon.data.discount_type == '1'
                        ? `${coupon.data.discount}%`
                        : `₹${coupon.data.discount}`
                };

                setCoupons([processedCoupon]);
                setShowCoupons(true);
                setActiveTab(processedCoupon.status);
            } catch (error) {
                console.error('Error fetching coupon by ID:', error);
            }
        };

        if (id) {
            loadCouponById(id);
        } else {
            fetchCoupons();
        }
    }, [id]);


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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleStatusChange = (coupon) => {
        setSelectedCoupon(coupon);
        setOpenDialog(true);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
    
        const { title, discount, discount_type, min_order_value, description } = formData;
    
        // Check if any required fields are missing
        if (!title || !discount || !discount_type || !min_order_value || !description) {
            toast.error("Please fill out all fields.");
            return;
        }
    
        // Convert discount and discount_type to integers
        const convertedFormData = {
            ...formData,
            discount: parseInt(discount, 10),        // Convert discount to an integer
            discount_type: parseInt(discount_type, 10),  // Convert discount_type to an integer
        };
    
        try {
            const response = await addNewCoupon(convertedFormData);  // Use the updated formData
            console.log('Response:', response);
    
            toast.success("Form has been submitted successfully!");
    
            const newCoupon = {
                ...response.data,
                status: 'active',
                formattedDiscount: convertedFormData.discount_type === 1 ? `${convertedFormData.discount}%` : `₹${convertedFormData.discount}`
            };
    
            setCoupons([...coupons, newCoupon]);
    
            // Reset the form data
            setFormData({
                title: '',
                discount: '',
                discount_type: '1',
                min_order_value: '',
                description: '',
            });
    
            setShowForm(false);
            setShowCoupons(true);
    
        } catch (err) {
            console.log('Err', err.response?.data || err.message);
            toast.error("Error submitting the form. Please try again.");
        }
    };
    
    const confirmStatusChange = async () => {
        try {
            const toggledStatus = await toggleCouponStatus(selectedCoupon.id);
            console.log(toggledStatus);
            const updatedCoupon = {
                ...selectedCoupon,
                status: selectedCoupon.status === 'active' ? 'inactive' : 'active'
            };
            setCoupons(coupons.map(coupon => (coupon.id === selectedCoupon.id ? updatedCoupon : coupon)));
            setOpenDialog(false);
            setActiveTab(updatedCoupon.status);
        } catch (error) {
            console.error('Error toggling coupon status:', error);
        }
    };

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
            <ToastContainer />
            <div className="card border-0 p-3">
                <h3 className="mb-0">Discount Offers</h3>
            </div>
            <div className="border-0">
                <div className="card-body">
                    <div className="add-coupon">
                        <Button onClick={handleTrackOffers} className={showCoupons ? 'active' : ''}>Track Offers</Button>
                        <Button onClick={handleForm} className={showForm ? 'active' : ''}>Create Offers</Button>
                    </div>
                    <div className="coupon-list">
                        {showForm && (
                            <div className="coupon-form">
                                <form onSubmit={handleFormSubmit}>
                                    <div className="form-content">
                                        <div>
                                            <label>Title</label>
                                            <input type="text" name="title" placeholder='Coupon Title' value={formData.title} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label>Discount</label>
                                            <input type="text" name="discount" placeholder='Coupon Discount' value={formData.discount} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label>Discount Type:</label>
                                            <select
                                                className="form-select"
                                                name="discount_type"
                                                value={formData.discount_type}
                                                onChange={handleChange}>
                                                <option value="1">Percentage</option>
                                                <option value="2">Fixed Amount</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label>Min-order Value</label>
                                            <select className="form-select" name='min_order_value' value={formData.min_order_value} onChange={handleChange}>
                                                <option defaultValue>Orders above</option>
                                                <option value="1">One</option>
                                                <option value="2">Two</option>
                                                <option value="3">Three</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='textbox'>
                                        <label>Description</label>
                                        <textarea name="description" placeholder='Coupon Description' value={formData.description} onChange={handleChange}></textarea>
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
                                <ul className='coupons-container'>
                                    {activeTab === 'active' && activeCount === 0 && (
                                        <p>No active offers</p>
                                    )}
                                    {activeTab === 'inactive' && inactiveCount === 0 && (
                                        <p>No inactive offers</p>
                                    )}
                                    {activeTab === 'all' && allCount === 0 && (
                                        <p>Offers not available</p>
                                    )}
                                    {filteredCoupons.map((coupon, index) => (
                                        <li key={coupon.id || index} className='coupons-body'>
                                            <div className="leftbox">
                                                <div className="content">
                                                    <div className="heading">
                                                        <h1>{coupon.title}</h1>
                                                        <span className={coupon.status === 'active' ? 'active' : 'inactive'}>{coupon.status}</span>
                                                    </div>
                                                    <div className="body">
                                                        <p className='description'>{coupon.description}</p>
                                                        <p><GoDotFill size={10} /> Minimum Order Value: {coupon.min_order_value || 'N/A'}</p>
                                                    </div>
                                                    <Button className={coupon.status === 'active' ? 'stop-offer' : 'start-offer'}
                                                        onClick={() => handleStatusChange(coupon)}>
                                                        {coupon.status === 'active' ? 'Stop Offer' : 'Start Offer'}
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className={`rightBox rightBox-${index % 5}`}>
                                                <div className="content">
                                                    <h4>{coupon.formattedDiscount || 'N/A'} OFF</h4>
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
    );
};

export default Coupons;