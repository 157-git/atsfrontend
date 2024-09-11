import React, { useState, useEffect } from 'react';

const Loader = () => {
    const [text, setText] = useState('');
    const fullText = "Recruiter's Gear";

    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <div className="spinner"></div>
                <div className="loader-text" style={{ fontSize: "25px", fontWeight: "bold" }}>{fullText}</div>
            </div>
        </div>
    );
};

export default Loader;
