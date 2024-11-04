/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */

import React, { useState } from 'react'
import '../components/style.scss'
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from '@mui/material/Button';
import { IoTrendingUpSharp } from "react-icons/io5";
import { IoTrendingDownSharp } from "react-icons/io5";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { FaClockRotateLeft } from "react-icons/fa6";



const ITEM_HEIGHT = 48;

const DashboardBox = ({ color, icon, grow, title }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="dashboardBox"
            style={{
                backgroundImage: `linear-gradient(to right, ${color[0]}, ${color[1]})`
            }}>

            <div className="d-flex w-100">
                <div className="col1">
                    <h4>{title}</h4>
                    <span>277</span>
                </div>

                <div className="ms-auto">
                    <span className='icon'> {icon} </span>
                </div>
            </div>

            {
                grow === true ?

                    <span className='trending'><IoTrendingUpSharp /></span>

                    :

                    <span className='trending'><IoTrendingDownSharp /></span>


            }

            <div className="d-flex align-items-center w-100">
                <h6>Last Month</h6>

                <div className="ms-auto">
                    <Button className='toggleIcon' onClick={handleClick}><BsThreeDotsVertical /></Button>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                            style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: '20ch',
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

        </div>
    )
}

export default DashboardBox;