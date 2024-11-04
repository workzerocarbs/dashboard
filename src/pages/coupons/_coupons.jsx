/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../coupons/style.scss';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { GoDotFill } from "react-icons/go";

const Coupons = () => {
    const [showForm, setShowForm] = useState(false);
    const [showCoupons, setShowCoupons] = useState(true);
    const [activeTab, setActiveTab] = useState('active');
    const [coupons, setCoupons] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        discount: '',
        description: '',
        minOrderValue: ''
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleStatusChange = (coupon) => {
        setSelectedCoupon(coupon);
        setOpenDialog(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const { title, discount, description, minOrderValue } = formData;

        if (title.trim() === '' || discount.trim() === '' || description.trim() === '' || minOrderValue.trim() === '') {
            alert('All fields are required.');
            return;
        }

        const newCoupon = {
            id: coupons.length + 1,
            title,
            discount,
            desc: description,
            status: 'active',
            minOrderValue
        };

        const updatedCoupons = [...coupons, newCoupon];
        setCoupons(updatedCoupons);
        setShowForm(false);
        setShowCoupons(true);
        setActiveTab('active');
        setFormData({ title: '', discount: '', description: '', minOrderValue: '' });
    };

    const confirmStatusChange = () => {
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
        document.title = "ZeroCarbs | Coupons";

        const fetchCoupons = async () => {
            try {
                const response = await axios.get('/coupons.json');
                setCoupons(response.data);
            } catch (error) {
                console.error('Error fetching coupons:', error);
            }
        };

        fetchCoupons();
    }, []);

    const filteredCoupons = coupons.filter(coupon => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return coupon.status === 'active';
        if (activeTab === 'inactive') return coupon.status === 'inactive';
        return true;
    });

    const activeCount = coupons.filter(coupon => coupon.status === 'active').length;
    const inactiveCount = coupons.filter(coupon => coupon.status === 'inactive').length;
    const allCount = coupons.length;

    return (
        <div className='body-content'>
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
                                            <input type="number" name="discount" placeholder='Coupon Discount' value={formData.discount} onChange={handleChange} />
                                        </div>
                                        <div>
                                            <label>Min-order Value</label>
                                            <select className="form-select" name='minOrderValue' value={formData.minOrderValue} onChange={handleChange}>
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
                                    {filteredCoupons.map((coupon, index) => (
                                        <li key={coupon.id} className='coupons-body'>
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
    );
};

export default Coupons;
