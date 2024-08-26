import React, { useState, useEffect } from 'react';

const Loader = () => {
    const [text, setText] = useState('');
    const fullText = "Recruiter's Gear";
    const typingSpeed = 900; 

    useEffect(() => {
        const words = fullText.split(' '); 
        let index = 0;

        const interval = setInterval(() => {
            setText((prev) => (prev ? prev + ' ' : '') + words[index]); 
            index++;
            if (index === words.length) {
                clearInterval(interval);
                setTimeout(() => {
                    setText(''); 
                }, 2000); 
            }
        }, typingSpeed);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loader-overlay">
            <div className="loader-container">
                <div className="spinner"></div>
                <div className="loader-text" style={{fontSize:"25px",fontWeight:"bold"}}>{text}</div>
            </div>
        </div>
    );
};

export default Loader;
