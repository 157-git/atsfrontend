
/* Name:-Prachi Parab Component:-Slider report
        End LineNo:-7 to 31 Date:-10/07 */
import React from 'react';
import '../Reports/SliderReports.css';

const ProgressBar = ({ totalCandidateCount }) => {


  const calculatePosition = () => {

    if (totalCandidateCount >= 12) {

      return '110px';
    } else if (totalCandidateCount < 10 && totalCandidateCount > 8) {
      return '40px';
    } else if (totalCandidateCount < 8 && totalCandidateCount > 5) {
      return '-35px';
    } else if (totalCandidateCount < 5 && totalCandidateCount > 1) {
      return '-110px';
    } else {
      return '0px';
    }
  };

  const iconStyle = {

    left: calculatePosition(),


  }
  return (
    <div className="progress-bar">
      <div className="progress-bar-inner">

        <div className="poor">
          <h6 >Poor</h6>
        </div>

        <div className="average" >
          <h6>Average</h6>
        </div>

        <div className="good" >
          <h6>Good</h6>
        </div>

        <div className="best"  >
          <h6>Best</h6>
        </div>

      </div >
      <div className="indicator_uptriangle" style={iconStyle}>
        {/* <i class="fa-regular fa-i" ></i>     */}
        <i class="fa-solid fa-caret-down"></i>
      </div>

    </div>
  );
};

export default ProgressBar;
