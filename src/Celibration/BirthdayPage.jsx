// import React, { useState } from 'react';
// import './BirthdayPage.css'; // Import your CSS file for styling
// import Bdayimg from '../Celibration/bdayimg1.png'; // Import your birthday gift image

// const BirthdayPage = ({ name }) => {
//   const [showMessage, setShowMessage] = useState(false); // State to manage showing the birthday message

//   const handleGiftClick = () => {
//     setShowMessage(true); // Sets showMessage to true when the gift box is clicked
//   };

//   return (
//     <div className="birthday-page">
//       <div className="gift-box" onClick={handleGiftClick}>
//         <img src={Bdayimg} alt="Gift" className="gift-image" />
//       </div>
//       {showMessage && (
//         <div className="balloon-container">

//             <span role="img" aria-label="Balloon">🎈</span> Happy Birthday {name}! <span role="img" aria-label="Cake">🎂</span>
//           </div>
       
//       )}
//     </div>
//   );
// };

// export default BirthdayPage;

// import React, { useState } from 'react';
// import './BirthdayPage.css'; // Import your CSS file for styling
// import Bdayimg from '../Celibration/bdayimg1.png'; // Import your birthday gift image

// const BirthdayPage = ({ name }) => {
//   const [showBalloons, setShowBalloons] = useState(false); // State to manage showing balloons
//   const [balloons, setBalloons] = useState([]); // State to store balloons

//   const handleGiftClick = () => {
//     // Show balloons and initiate their animation
//     setShowBalloons(true);
//     setBalloons([...balloons, { id: balloons.length + 1 }]);
//   };

//   return (
//     <div className="birthday-page">
//       <div className="gift-box" onClick={handleGiftClick}>
//         <img src={Bdayimg} alt="Gift" className="gift-image" />
//       </div>
//       {showBalloons &&
//         balloons.map((balloon) => (
//           <div className="balloon" key={balloon.id}>
//             <span role="img" aria-label="Balloon">🎈</span>
//           </div>
//         ))}
//       {showBalloons && (
//         <div className="message-container">
//           <div className="message">
//             <span role="img" aria-label="Balloon">🎈</span> Happy Birthday {name}! <span role="img" aria-label="Cake">🎂</span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BirthdayPage;


import React, { useState, useEffect } from 'react';
import './BirthdayPage.css'; // Import your CSS file for styling
import Bdayimg from '../Celibration/bdayimg1.png'; // Import your birthday gift image

const BirthdayPage = ({ name }) => {
  const [showBalloons, setShowBalloons] = useState(false); // State to manage showing balloons
  const [balloons, setBalloons] = useState([]); // State to store balloons

  useEffect(() => {
    let interval;
    if (showBalloons) {
      interval = setInterval(() => {
        setBalloons((prevBalloons) => [
          ...prevBalloons,
          { id: prevBalloons.length + 1, left: Math.random() * 100 + '%' }
        ]);
      }, 500); // Add a new balloon every 500ms
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [showBalloons]);

  const handleGiftClick = () => {
    setShowBalloons(true); // Start showing balloons when the gift box is clicked
  };

  return (
    <div className="birthday-page">
      <div className="gift-box" onClick={handleGiftClick}>
        <img src={Bdayimg} alt="Gift" className="gift-image" />
      </div>
      {showBalloons &&
        balloons.map((balloon) => (
          <div className="balloon" key={balloon.id} style={{ left: balloon.left }}>
            <span role="img" aria-label="Balloon">🎈🎊</span>
            <span role="img" aria-label="Balloon">🎉</span>
          </div>
        ))}
      {showBalloons && (
        <div className="message-container">
          <div className="message">
            <span role="img" aria-label="Balloon">🎈</span> Happy Birthday {name}! <span role="img" aria-label="Cake">🎂</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BirthdayPage;
