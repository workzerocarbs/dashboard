/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
// Modal.js
import React, { useState, useEffect } from 'react';
import '../itemContent/style.scss';
import Button from '@mui/material/Button';
import { IoClose } from "react-icons/io5";

const Modal = ({ isOpen, onClose, onConfirm }) => {
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        if (isOpen) {
            setSelectedOption(null);
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleConfirm = () => {
        if (selectedOption) {
            onConfirm(selectedOption); // Pass selectedOption to onConfirm
        }
    };

    return (
        <div className="modal-overlay">
            <div className="content">
                <div className="header">
                    <h4>When will this be available?</h4>
                    <button className="close-button" onClick={onClose}><IoClose size={25} color='red' /></button>
                </div>
                <div className="modal-content">
                    <div className="modalDesc">
                        <h6>Auto turn on after</h6>
                        <div className="box">
                            <div className="boxfields">
                                <p>2 hours</p>
                                <input type="radio" value="2 hours" checked={selectedOption === '2 hours'} onChange={handleOptionChange} />
                            </div>
                            <div className="boxfields">
                                <p>4 hours</p>
                                <input type="radio" value="4 hours" checked={selectedOption === '4 hours'} onChange={handleOptionChange} />
                            </div>
                            <div className="boxfields">
                                <p>Next Business Day</p>
                                <input type="radio" value="Next Business Day" checked={selectedOption === 'Next Business Day'} onChange={handleOptionChange} />
                            </div>
                        </div>
                    </div>
                    <div className="modalDesc">
                        <h6>Manually turn on</h6>
                        <div className="box">
                            <div className="boxfields">
                                <p>I will turn it on myself</p>
                                <input type="radio" value="I will turn it on myself" checked={selectedOption === 'I will turn it on myself'} onChange={handleOptionChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer">
                    <Button
                        onClick={handleConfirm}
                        disabled={!selectedOption}
                        className={`footer-button ${!selectedOption ? 'disabled' : ''}`}
                    >
                        Confirm Changes
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Modal;




// import React, { useState, useEffect } from 'react';
// import '../itemContent/style.scss';
// import Button from '@mui/material/Button';
// import { IoClose } from "react-icons/io5";

// const Modal = ({ isOpen, onClose, onConfirm }) => {
//     const [selectedOption, setSelectedOption] = useState(null);

//     useEffect(() => {
//         if (isOpen) {
//             setSelectedOption(null);
//             document.body.classList.add('no-scroll');
//         } else {
//             document.body.classList.remove('no-scroll');
//         }

//         return () => {
//             document.body.classList.remove('no-scroll');
//         };
//     }, [isOpen]);

//     if (!isOpen) return null;

//     const handleOptionChange = (event) => {
//         setSelectedOption(event.target.value);
//     };

//     const handleConfirm = () => {
//         if (selectedOption) {
//             onConfirm();
//         }
//     };

//     return (
//         <div className="modal-overlay">
//             <div className="content">
//                 <div className="header">
//                     <h4>When will this be available?</h4>
//                     <button className="close-button" onClick={onClose}><IoClose size={25} color='red' /></button>
//                 </div>
//                 <div className="modal-content">
//                     <div className="modalDesc">
//                         <h6>Auto turn on after</h6>
//                         <div className="box">
//                             <div className="boxfields">
//                                 <p>2 hours</p>
//                                 <input type="radio" value="2 hours" checked={selectedOption === '2 hours'} onChange={handleOptionChange} />
//                             </div>
//                             <div className="boxfields">
//                                 <p>4 hours</p>
//                                 <input type="radio" value="4 hours" checked={selectedOption === '4 hours'} onChange={handleOptionChange} />
//                             </div>
//                             <div className="boxfields">
//                                 <p>Next Business Day</p>
//                                 <input type="radio" value="Next Business Day" checked={selectedOption === 'Next Business Day'} onChange={handleOptionChange} />
//                             </div>
//                         </div>
//                     </div>
//                     <div className="modalDesc">
//                         <h6>Manually turn on</h6>
//                         <div className="box">
//                             <div className="boxfields">
//                                 <p>I will turn it on myself</p>
//                                 <input type="radio" value="I will turn it on myself" checked={selectedOption === 'I will turn it on myself'} onChange={handleOptionChange} />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="footer">
//                     <Button
//                         onClick={handleConfirm}
//                         disabled={!selectedOption}
//                         className={`footer-button ${!selectedOption ? 'disabled' : ''}`}
//                     >
//                         Confirm Changes
//                     </Button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Modal;
