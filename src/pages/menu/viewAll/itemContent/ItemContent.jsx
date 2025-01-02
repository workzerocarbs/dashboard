/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import '../itemContent/style.scss';
import { MdOutlineCurrencyRupee, MdDeleteForever } from "react-icons/md";
import { FaPencilAlt } from "react-icons/fa";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from '@mui/material/Button';
import Modal from './Modal';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteMenuItem, fetchMenuItem, fetchMenuItemById, toggleStockStatus, toggleTypeCategory } from '../../../../utils/MenuAPI';
import { useNavigate, useParams } from 'react-router-dom';
import { imageUrl } from '../../../../api/ApiConfig';
import vegImage from '../../../../assets/images/veg.svg';
import nonVegImage from '../../../../assets/images/non-veg.svg';

const ItemContent = ({ item }) => {
    console.log(item)
    const [activeTab, setActiveTab] = useState('All');
    const [menuItems, setMenuItems] = useState([]);
    const [toggleStates, setToggleStates] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pendingToggleIndex, setPendingToggleIndex] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [pendingEditIndex, setPendingEditIndex] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    // Get Menu Items
    useEffect(() => {
        const getItems = async () => {
            const categoryId = id !== undefined ? id : item.id || null;
            setCategoryId(categoryId);
            try {
                if (categoryId) {
                    const fetchedMenuById = await fetchMenuItemById(categoryId);
                    const item = fetchedMenuById.data;
                    setMenuItems([item]);
                   
                    setToggleStates([{
                        isToggled: item.status !== undefined ? !!item.status : true,
                        label: item.status !== undefined ? (item.status ? 'In Stock' : 'Out of Stock') : 'In Stock',
                        labelColor: item.status !== undefined ? (item.status ? 'rgb(148 199 39)' : 'red') : 'rgb(148 199 39)',
                    }]);
                } else {
                    const fetchedMenuItem = await fetchMenuItem();
                    const items = fetchedMenuItem.data.map(item => ({
                        ...item,
                        status: item.status !== undefined ? !!item.status : true,
                    }));
                    setMenuItems(items);
                    setToggleStates(items.map(item => ({
                        isToggled: !!item.status,
                        label: item.status ? 'In Stock' : 'Out of Stock',
                        labelColor: item.status ? 'rgb(148 199 39)' : 'red',
                    })));
                }
            } catch (err) {
                console.log("Error fetching items:", err);
            }
        };
        getItems();
        setActiveTab('All');
       
    }, [id, item.id]);

    const handleTabClick = async (tab) => {
        setActiveTab(tab);
        try {
            const lowerCaseTab = tab.toLowerCase();
            
            const fetchedMenuItems = await toggleTypeCategory(lowerCaseTab, categoryId);
            if (fetchedMenuItems && fetchedMenuItems.data) {
                const items = fetchedMenuItems.data.map(item => ({
                    ...item,
                    status: item.status !== undefined ? !!item.status : true,
                }));
                setMenuItems(items);
                setToggleStates(items.map(item => ({
                    isToggled: !!item.status,
                    label: item.status ? 'In Stock' : 'Out of Stock',
                    labelColor: item.status ? 'rgb(148 199 39)' : 'red',
                })));
            } else {
                console.error("Unexpected data format received:", fetchedMenuItems);
            }
        } catch (err) {
            console.error("Error toggling category:", err);
        }
    };


    const handleToggle = (index) => {
        const newToggleStates = [...toggleStates];
        if (newToggleStates[index].isToggled) {
            setPendingToggleIndex(index);
            setIsModalOpen(true);
        } else {
            newToggleStates[index].isToggled = true;
            newToggleStates[index].label = 'In Stock';
            newToggleStates[index].labelColor = 'rgb(148 199 39)';
            setToggleStates(newToggleStates);
            updateStockStatus(index, true, null);
        }
    };

    const handleConfirmToggle = async (selectedOption) => {
        const index = pendingToggleIndex;
        if (index !== null) {
            const newToggleStates = [...toggleStates];
            newToggleStates[index].isToggled = false;
            newToggleStates[index].label = 'Out of Stock';
            newToggleStates[index].labelColor = 'red';
            setToggleStates(newToggleStates);
            setPendingToggleIndex(null);
            setIsModalOpen(false);

            updateStockStatus(index, false, selectedOption);
        }
    };

    // Toggling of the status
    const updateStockStatus = async (index, status, statusChangeTime) => {
        const item = menuItems[index];
        try {
            const response = await toggleStockStatus(item.id, status, statusChangeTime);
            console.log("Toggle Stock Status Response:", response);
        } catch (error) {
            console.error("Failed to update stock status:", error);

            // Revert the optimistic UI update
            const newToggleStates = [...toggleStates];
            newToggleStates[index].isToggled = !status;
            newToggleStates[index].label = !status ? 'In Stock' : 'Out of Stock';
            newToggleStates[index].labelColor = !status ? 'rgb(148 199 39)' : 'red';
            setToggleStates(newToggleStates);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setPendingToggleIndex(null);
    };

    // Delete Menu Item
    const handleDeleteItem = async (index) => {
        const item = menuItems[index];
        try {
            await deleteMenuItem(item.id);

            const newMenuItems = menuItems.filter((_, i) => i !== index);
            setMenuItems(newMenuItems);

        } catch (err) {
            console.log('Err', err);
        }
    }

    // Edit Menu
    const handleEdit = (index) => {
        setPendingEditIndex(index);
        setOpenDialog(true);
    }

    const cancelEdit = () => {
        setOpenDialog(false);
        setPendingEditIndex(null);
    }

    const confirmEdit = async () => {
        setOpenDialog(false);

        try {
            const item = menuItems[pendingEditIndex];
            const response = await fetchMenuItemById(item.id);

            if (response && response.data) {
                const itemData = response.data;
                navigate('/menu/item', { state: { itemData, isEdit : true } });
            } else {
                console.error("Failed to fetch item details for editing.");
            }
        } catch (error) {
            console.error("Error fetching item data:", error);
        }
    }

    const filteredItems = menuItems.filter((detail) => {
        if (activeTab === 'All') return true;
        if (activeTab === 'Veg') return detail.type === 'veg';
        if (activeTab === 'Non-Veg') return detail.type === 'non-veg';
    });

    // Quick fix of not loading all menu items

    function clickAllButton() {
        const allBtn = document.getElementById('allBtn');
        if (allBtn) {
          allBtn.click();
        }
      }
      
      useEffect(() => {
        // Delay the click to ensure the DOM is fully rendered
        setTimeout(clickAllButton, 500);
      }, []);
      

    return (
        <div className="itemContent">
            <h2>{item.name}</h2>
            <div className="tabs">
                <button id='allBtn' className={activeTab === 'All' ? 'active' : ''} onClick={() => handleTabClick('All')}>All</button>
                <button className={activeTab === 'Veg' ? 'active' : ''} onClick={() => handleTabClick('Veg')}>Veg</button>
                <button className={activeTab === 'Non-Veg' ? 'active' : ''} onClick={() => handleTabClick('Non-Veg')}>Non-Veg</button>
            </div>
            <ul className="item-details">
                {filteredItems && filteredItems.length > 0 ? (
                    filteredItems.map((detail, index) => (
                        <li key={index} className="item-detail">
                            <div className="leftBox">
                                <img src={`${imageUrl}${detail.image}`} alt="Image" />
                            </div>
                            <div className="rightBox">
                                <div className="type-image">
                                    <img src={detail.type === 'veg' ? vegImage : nonVegImage}
                                        alt={detail.type === 'veg' ? 'Veg' : 'Non-Veg'} />
                                </div>
                                <h4>{detail.name}</h4>
                                <h6>Price: <MdOutlineCurrencyRupee />{detail.price}</h6>
                                <p>{detail.description}</p>
                                <div className="energyCalc">
                                    {detail.nutritions && detail.nutritions.length > 0 ? (
                                        detail.nutritions.map((nutrition, idx) => (
                                            <React.Fragment key={idx}>
                                                <span>{nutrition.value}g {nutrition.type}</span>
                                                {idx < detail.nutritions.length - 1 && <div>|</div>}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        <span>N/A</span>
                                    )}
                                </div>
                                <div className="combine-group">
                                    <div className='toggleContainer'>
                                        <FormControlLabel
                                            value="start"
                                            control={<Switch checked={!!toggleStates[index].isToggled} color="primary" />}
                                            label={toggleStates[index].label}
                                            labelPlacement="start"
                                            onChange={() => handleToggle(index)}
                                            style={{ color: toggleStates[index].labelColor }}
                                        />
                                    </div>
                                    <div className="buttons-group">
                                        <Button onClick={() => handleEdit(index)}><FaPencilAlt size={16} /></Button>
                                        <Button className='deleteBtn' onClick={() => handleDeleteItem(index)}><MdDeleteForever size={26} /></Button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <span>N/A</span>
                )}
            </ul>
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onConfirm={handleConfirmToggle}
            />

            <Dialog open={openDialog} onClose={cancelEdit}>
                <DialogTitle>Confirm Edit</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to edit this category?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelEdit} color="primary">
                        No
                    </Button>
                    <Button onClick={confirmEdit} color="primary">
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ItemContent;