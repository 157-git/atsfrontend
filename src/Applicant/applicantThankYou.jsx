//This is done by vaibhavi kawarkhe Date: 10-12-2024
//Task: Applicant Form

import React,{useEffect} from 'react';
import './applicantThankYou.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import confetti from 'canvas-confetti';

function ThankYouPage() {
  // Trigger confetti animation when component mounts
  useEffect(() => {
    confetti(
      {particleCount: 500,      // Number of particles
      angle: 90,               // Direction of confetti (angle)
      spread: 60,              // Spread of the confetti
      origin: { x: 0.5, y: 0.5 }, // Where the confetti comes from (center of screen)
      duration: 6000,          // Duration of the confetti animation (5 seconds)
      gravity: 1.3,            // How fast the confetti falls
      drift: 0.3  }             // Horizontal movement
    );
  }, []);
  return (
    <div className="thank-you-container">
      <div className="thank-you-content">
        <div className="green-tick">
          {/* Font Awesome Green Check */}
          <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', fontSize: '100px' }} />
        </div>
        <div className="thank-you-message">
          <h1>Thank You for applying!</h1>
          <p>We sincerely appreciate your interest and the time you’ve taken to complete the form.</p>
          <p>Our team will review your application, and we will be in touch with you soon.</p>
          <p>Wishing you the very best in your journey!</p>
        </div>
      </div>
    </div>
  );
}

export default ThankYouPage;
