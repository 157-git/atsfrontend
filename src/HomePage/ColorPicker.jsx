import React, { useState, useEffect } from 'react';
import './ColorPicker.css';

const ColorPicker = ({ onColorApplied }) => {
    const [value, setValue] = useState(50);
    const [bgColor, setBgColor] = useState('');

    useEffect(() => {
        const savedColor = localStorage.getItem('selectedColor');
        if (savedColor) {
            setBgColor(savedColor);
        }
    }, []);

    const applyColor = (color) => {
        const darkenColor = (color, amount) => {
            let colorInt = parseInt(color.slice(1), 16);
            let r = (colorInt >> 16) + amount;
            let g = ((colorInt >> 8) & 0x00ff) + amount;
            let b = (colorInt & 0x0000ff) + amount;

            r = Math.max(Math.min(255, r), 0);
            g = Math.max(Math.min(255, g), 0);
            b = Math.max(Math.min(255, b), 0);

            return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
        };

        const hoverColor = darkenColor(color, -30);

        document.documentElement.style.setProperty('--Bg-color', color);
        document.documentElement.style.setProperty('--button-color', color);
        document.documentElement.style.setProperty('--button-hover-color', hoverColor);
        document.documentElement.style.setProperty('--hover-effect', hoverColor);
        document.documentElement.style.setProperty('--filter-color', color);
    };

    const handleColorClick = (color) => {
        setBgColor(color);
        localStorage.setItem('selectedColor', color);
        const url = new URL(window.location);
        url.searchParams.delete('color');
        window.history.pushState({}, '', url);
    };

    const applySelectedColor = () => {
        applyColor(bgColor);
        onColorApplied(bgColor);
    };

    const calculateNeedleAngle = (value) => {
        const minValue = 0;
        const maxValue = 100;
        const minAngle = -90;
        const maxAngle = 90;
        const normalizedValue = (value - minValue) / (maxValue - minValue);
        return minAngle + normalizedValue * (maxAngle - minAngle);
    };

    const segmentColors = [
        '#a8d5ba', '#f5d0c5', '#f9f1a5', '#d5e1df',
        '#ffdfba', '#c6e2e9', '#f7c8e0', '#f8c8dc',
        '#e4c2d1', '#ffdac1'
    ];

    const getSegmentColor = (angle) => {
        const totalSegments = 10;
        const segmentAngle = 180 / totalSegments;
        const segmentIndex = Math.floor((angle + 90) / segmentAngle);
        return segmentColors[segmentIndex] || '#FFFFFF';
    };

    const handleInputChange = (event) => {
        const newValue = Number(event.target.value);
        setValue(newValue);
        const needleAngle = calculateNeedleAngle(newValue);
        const color = getSegmentColor(needleAngle);
        setBgColor(color);
    };

    const needleAngle = calculateNeedleAngle(value);

    return (
        <div className="color-picker-container">
            <div className="svg-container">
                <svg
                    width="200"
                    height="120"
                    viewBox="0 0 200 100"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M 20,80 A 80,80 0 0,1 180,80"
                        fill="none"
                        strokeWidth="20"
                    />
                    {segmentColors.map((color, index) => {
                        const startAngle = -90 + (180 / segmentColors.length) * index;
                        const endAngle = startAngle + (180 / segmentColors.length);

                        const startX = 100 + 80 * Math.cos((startAngle - 90) * (Math.PI / 180));
                        const startY = 80 + 80 * Math.sin((startAngle - 90) * (Math.PI / 180));
                        const endX = 100 + 80 * Math.cos((endAngle - 90) * (Math.PI / 180));
                        const endY = 80 + 80 * Math.sin((endAngle - 90) * (Math.PI / 180));

                        return (
                            <path
                                key={index}
                                d={`M 100,80 L ${startX},${startY} A 80,80 0 0,1 ${endX},${endY} Z`}
                                fill={color}
                                stroke="none"
                                onClick={() => handleColorClick(color)}
                            />
                        );
                    })}
                    <line
                        x1="100"
                        y1="80"
                        x2="100"
                        y2="20"
                        stroke="#888"
                        strokeWidth="4"
                        transform={`rotate(${needleAngle}, 100, 80)`}
                    />
                    <circle cx="100" cy="80" r="6" fill="#888" />
                </svg>
            </div>
            <div className="spedometer">
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={handleInputChange}
                    className="range-slider"
                />
            </div>
            <button
                onClick={applySelectedColor}
                className="apply-button"
            >
                Apply Color
            </button>
        </div>
    );
};

export default ColorPicker;
