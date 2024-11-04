// /* eslint-disable no-unused-vars */
// /* eslint-disable react/prop-types */
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useMediaQuery } from '@mui/material';
// import axios from 'axios';
// import logo from '../../assets/logo/zerocarbs-logo.jpeg';
// import logo2 from '../../assets/logo/logo.jpeg';
// import proImg from '../../assets/logo/logo_black.png';
// import '../header/style.scss';
// import Button from '@mui/material/Button';
// import { MdMenuOpen, MdLightMode, MdDarkMode, MdLogout, MdMenu, MdErrorOutline } from "react-icons/md";
// import { FaRegBell, FaUser } from "react-icons/fa";
// import { BsShieldFillExclamation } from "react-icons/bs";
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import Modal from "../modal/CustomModal";

// const Header = ({ toggleSidebar, isSidebarOpen, toggleTheme, theme }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [resetPassword, setResetPassword] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(0);
//   const navigate = useNavigate();

//   const open = Boolean(anchorEl);
//   const isSmallScreen = useMediaQuery('(max-width: 640px)');
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     document.title = "ZeroCarbs | Notifications";

//     axios.get('/notifications.json')
//       .then(response => {
//         setNotificationCount(response.data.length);
//       })
//       .catch(error => {
//         console.error('Error fetching notifications:', error);
//       });
//   }, []);

//   const handleClickMyAcc = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleCloseMyAcc = () => {
//     setAnchorEl(null);
//   };

//   const handleShowResetPassword = () => {
//     setResetPassword(true)
//   }

//   const handleCloseResetPassword = () => {
//     setResetPassword(false);
//   }

//   const handleSubmitForm = (e) => {
//     e.preventDefault();
//   }

//   const handleShowModal = () => {
//     setShowModal(true);
//   }

//   const handleCloseModal = () => {
//     setShowModal(false);
//   }

//   const handleLogout = () => {
//     localStorage.setItem('isAuthenticated', 'false');
//     setShowModal(false);
//     navigate('/login');
//   }

//   const handleNavigate = () => {
//     navigate('/notifications');
//   }

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <header className={`d-flex align-items-center ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//       <div className={`container-fluid w-100 ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//         <div className="row w-100">
//           <div className={`col-sm-2 part1 ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//             <Link to='/dashboard' className="d-flex align-items-center logo">
//               {isSidebarOpen && !isSmallScreen ? (
//                 <img src={logo} alt="logo" />
//               ) : (
//                 <img src={logo2} alt="logo2" className="logoIcon" />
//               )}
//             </Link>
//           </div>
//           <div className={`col-sm-3 d-flex align-items-center part2 ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//             <Button className="rounded-circle me-3" onClick={toggleSidebar}>
//               {
//                 isSidebarOpen ?
//                   <MdMenuOpen size={30} />
//                   :
//                   <MdMenu size={30} />
//               }
//             </Button>
//           </div>
//           <div className={`col-sm-7 d-flex align-items-center justify-content-end part3 ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//             <Button className="rounded-circle me-2" onClick={toggleTheme}>
//               {
//                 theme === 'light' ?
//                   (
//                     <MdDarkMode size={22} style={{ color: "orange" }} />
//                   ) : (
//                     <MdLightMode size={22} style={{ color: "orange" }} />
//                   )
//               }
//             </Button>
//             <Button className="rounded-circle me-2 notification-button" onClick={handleNavigate}>
//               <FaRegBell size={19} className="notification-bell"/>
//               <span className="notification-count">{notificationCount}</span>
//             </Button>
//             <div className="profileWrapper">
//               <Button className="profile d-flex align-items-center" onClick={handleClickMyAcc}>
//                 <div className="userImage">
//                   <span className="rounded-circle">
//                     <img src={proImg} alt="" />
//                   </span>
//                 </div>
//                 <div className="userInfo">
//                   <h4>Rishav Saha</h4>
//                 </div>
//               </Button>
//               <Menu
//                 anchorEl={anchorEl}
//                 id="account-menu"
//                 open={open}
//                 onClose={handleCloseMyAcc}
//                 onClick={handleCloseMyAcc}
//                 transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//                 anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//                 PaperProps={{
//                   elevation: 0,
//                   sx: {
//                     overflow: 'visible',
//                     filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
//                     mt: 1.5,
//                     '& .MuiAvatar-root': {
//                       width: 32,
//                       height: 32,
//                       ml: -0.5,
//                       mr: 1,
//                     },
//                     '&::before': {
//                       content: '""',
//                       display: 'block',
//                       position: 'absolute',
//                       top: 0,
//                       right: 14,
//                       width: 10,
//                       height: 10,
//                       bgcolor: 'background.paper',
//                       transform: 'translateY(-50%) rotate(45deg)',
//                       zIndex: 0,
//                     },
//                   },
//                 }}
//               >
//                 {/* <MenuItem onClick={handleCloseMyAcc}>
//                   <ListItemIcon>
//                     <FaUser size={20} />
//                   </ListItemIcon>
//                   My Account
//                 </MenuItem> */}
//                 <MenuItem onClick={handleShowResetPassword}>
//                   <ListItemIcon>
//                     <BsShieldFillExclamation size={20} />
//                   </ListItemIcon>
//                   Reset Password
//                 </MenuItem>
//                 <MenuItem onClick={handleShowModal} className="logoutBtn">
//                   <ListItemIcon>
//                     <MdLogout size={20} />
//                   </ListItemIcon>
//                   Logout
//                 </MenuItem>
//               </Menu>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       <Modal isVisible={resetPassword} onClose={handleCloseResetPassword}>
//         <div className="resetPassword">
//           <div className="content">
//             <h2>Reset Password</h2>
//             <form onClick={handleSubmitForm}>
//               <div className="input">
//                 <label>Current Password</label>
//                 <input type="text" placeholder="Enter current password" />
//               </div>
//               <div className="input">
//                 <label>New Password</label>
//                 <input type="text" placeholder="Enter new password" />
//               </div>
//               <div className="input">
//                 <label>Confirm New Password</label>
//                 <input type="text" placeholder="Enter new password" />
//               </div>
//               <Button>Confirm</Button>
//             </form>
//           </div>
//         </div>
//       </Modal>

//       <Modal isVisible={showModal} onClose={handleCloseModal}>
//         <div className="logoutModal">
//           <div className="content">
//             <MdErrorOutline size={120} />
//             <h2>Are you leaving ?</h2>
//             <h5>Are you sure want to logout? All your unsaved data will be lost.</h5>
//           </div>
//           <div className="confirmBtn">
//             <Button className="no-btn" onClick={handleCloseModal}>No</Button>
//             <Button className="yes-btn" onClick={handleLogout}>Yes, Sure</Button>
//           </div>
//         </div>
//       </Modal>
//     </header>
//   );
// };

// export default Header;



// /* eslint-disable react/prop-types */
// /* eslint-disable no-unused-vars */
// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useMediaQuery } from '@mui/material';
// import axios from 'axios';
// import logo from '../../assets/logo/zerocarbs-logo.jpeg';
// import logo2 from '../../assets/logo/logo.jpeg';
// import proImg from '../../assets/logo/logo_black.png';
// import '../header/style.scss';
// import Button from '@mui/material/Button';
// import { MdMenuOpen, MdLightMode, MdDarkMode, MdLogout, MdMenu, MdErrorOutline } from "react-icons/md";
// import { FaRegBell, FaUser } from "react-icons/fa";
// import { BsShieldFillExclamation } from "react-icons/bs";
// import Menu from '@mui/material/Menu';
// import MenuItem from '@mui/material/MenuItem';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import Modal from "../modal/CustomModal";
// import { logoutUser } from "../../utils/LoginAPI";

// const Header = ({ toggleSidebar, isSidebarOpen, toggleTheme, theme }) => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [resetPassword, setResetPassword] = useState(false);
//   const [notificationCount, setNotificationCount] = useState(0);
//   const navigate = useNavigate();

//   const open = Boolean(anchorEl);
//   const isSmallScreen = useMediaQuery('(max-width: 640px)');
//   const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

//   useEffect(() => {
//     document.title = "ZeroCarbs | Notifications";

//     axios.get('/notifications.json')
//       .then(response => {
//         setNotificationCount(response.data.length);
//       })
//       .catch(error => {
//         console.error('Error fetching notifications:', error);
//       });
//   }, []);

//   const handleClickMyAcc = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleCloseMyAcc = () => {
//     setAnchorEl(null);
//   };

//   const handleShowResetPassword = () => {
//     setResetPassword(true)
//   }

//   const handleCloseResetPassword = () => {
//     setResetPassword(false);
//   }

//   const handleSubmitForm = (e) => {
//     e.preventDefault();
//   }

//   const handleShowModal = () => {
//     setShowModal(true);
//   }

//   const handleCloseModal = () => {
//     setShowModal(false);
//   }

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem('authToken');
//       if (!token) {
//         throw new Error('No authentication token found. Please log in again.');
//       }

//       await logoutUser(token);

//       localStorage.removeItem('authToken');
//       localStorage.setItem('isAuthenticated', 'false');
//       setShowModal(false);
//       navigate('/login');
//     } catch (error) {
//       console.error('Error during logout:', error);
//       alert('Error during logout. Please try again later.');
//     }
//   };
  
//   const handleNavigate = () => {
//     navigate('/notifications');
//   }

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   return (
//     <header className={`d-flex align-items-center ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//       <div className={`container-fluid w-100 ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//         <div className="row w-100">
//           <div className={`col-sm-2 part1 ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//             <Link to='/dashboard' className="d-flex align-items-center logo">
//               {isSidebarOpen && !isSmallScreen ? (
//                 <img src={logo} alt="logo" />
//               ) : (
//                 <img src={logo2} alt="logo2" className="logoIcon" />
//               )}
//             </Link>
//           </div>
//           <div className={`col-sm-3 d-flex align-items-center part2 ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//             <Button className="rounded-circle me-3" onClick={toggleSidebar}>
//               {
//                 isSidebarOpen ?
//                   <MdMenuOpen size={30} />
//                   :
//                   <MdMenu size={30} />
//               }
//             </Button>
//           </div>
//           <div className={`col-sm-7 d-flex align-items-center justify-content-end part3 ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
//             <Button className="rounded-circle me-2" onClick={toggleTheme}>
//               {
//                 theme === 'light' ?
//                   (
//                     <MdDarkMode size={22} style={{ color: "orange" }} />
//                   ) : (
//                     <MdLightMode size={22} style={{ color: "orange" }} />
//                   )
//               }
//             </Button>
//             <Button className="rounded-circle me-2 notification-button" onClick={handleNavigate}>
//               <FaRegBell size={19} className="notification-bell" />
//               <span className="notification-count">{notificationCount}</span>
//             </Button>
//             <div className="profileWrapper">
//               <Button className="profile d-flex align-items-center" onClick={handleClickMyAcc}>
//                 <div className="userImage">
//                   <span className="rounded-circle">
//                     <img src={proImg} alt="" />
//                   </span>
//                 </div>
//                 <div className="userInfo">
//                   <h4>Zerocarbs</h4>
//                 </div>
//               </Button>
//               <Menu
//                 anchorEl={anchorEl}
//                 id="account-menu"
//                 open={open}
//                 onClose={handleCloseMyAcc}
//                 onClick={handleCloseMyAcc}
//                 transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//                 anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//                 PaperProps={{
//                   elevation: 0,
//                   sx: {
//                     overflow: 'visible',
//                     filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
//                     mt: 1.5,
//                     '& .MuiAvatar-root': {
//                       width: 32,
//                       height: 32,
//                       ml: -0.5,
//                       mr: 1,
//                     },
//                     '&::before': {
//                       content: '""',
//                       display: 'block',
//                       position: 'absolute',
//                       top: 0,
//                       right: 14,
//                       width: 10,
//                       height: 10,
//                       bgcolor: 'background.paper',
//                       transform: 'translateY(-50%) rotate(45deg)',
//                       zIndex: 0,
//                     },
//                   },
//                 }}
//               >
//                 {/* <MenuItem onClick={handleCloseMyAcc}>
//                   <ListItemIcon>
//                     <FaUser size={20} />
//                   </ListItemIcon>
//                   My Account
//                 </MenuItem> */}
//                 {/* <MenuItem onClick={handleShowResetPassword}>
//                   <ListItemIcon>
//                     <BsShieldFillExclamation size={20} />
//                   </ListItemIcon>
//                   Reset Password
//                 </MenuItem> */}
//                 <MenuItem onClick={handleShowModal} className="logoutBtn">
//                   <ListItemIcon>
//                     <MdLogout size={20} />
//                   </ListItemIcon>
//                   Logout
//                 </MenuItem>
//               </Menu>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Modal isVisible={resetPassword} onClose={handleCloseResetPassword}>
//         <div className="resetPassword">
//           <div className="content">
//             <h2>Reset Password</h2>
//             <form onClick={handleSubmitForm}>
//               <div className="input">
//                 <label>Current Password</label>
//                 <input type="text" placeholder="Enter current password" />
//               </div>
//               <div className="input">
//                 <label>New Password</label>
//                 <input type="text" placeholder="Enter new password" />
//               </div>
//               <div className="input">
//                 <label>Confirm New Password</label>
//                 <input type="text" placeholder="Enter new password" />
//               </div>
//               <Button>Confirm</Button>
//             </form>
//           </div>
//         </div>
//       </Modal>

//       <Modal isVisible={showModal} onClose={handleCloseModal}>
//         <div className="logoutModal">
//           <div className="content">
//             <MdErrorOutline size={120} />
//             <h2>Are you leaving ?</h2>
//             <h5>Are you sure want to logout? All your unsaved data will be lost.</h5>
//           </div>
//           <div className="confirmBtn">
//             <Button className="no-btn" onClick={handleCloseModal}>No</Button>
//             <Button className="yes-btn" onClick={handleLogout}>Yes, Sure</Button>
//           </div>
//         </div>
//       </Modal>
//     </header>
//   );
// };

// export default Header;