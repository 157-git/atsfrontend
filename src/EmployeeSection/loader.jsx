// import React, { useState, useEffect } from 'react';

// const Loader = () => {
//     const [text, setText] = useState('');
//     const fullText = "Recruiter's Gear";

//     return (
//         <div className="loader-overlay">
//             <div className="loader-container">
//                 <div className="spinner"></div>
//                 <div className="loader-text" style={{ fontSize: "25px", fontWeight: "bold" }}>{fullText}</div>
//             </div>
//         </div>
//     );
// };

// export default Loader;


import React from 'react';
import './loader.css';

/* Loader module edited by krishna kulkarni on 12-02-2024 */

const Loader = () => {
    const fullText = "Recruiter's Gear";

    return (
        <div className="loader-overlay">
            <div className="loader-container">
                {/* Outer container for spinner and RG */}
                <div className="spinner-container">
                    <div className="spinner"></div>
                    <span className="rg-text">RG</span> {/* This stays steady inside */}
                </div>
                <div className="loader-text">{fullText}</div>
            </div>
        </div>
    );
};

export default Loader;

