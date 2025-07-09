import { Button } from 'antd';
import React, { useState } from 'react';
import OfferLetter from './OfferLetter';
import AppointmentLetter from './AppointmentLetter';
import "../TeamLeader/issueOfferLetter.css";

const IssueOfferLetter = ({propOfDataFromOfferForm}) => {
    const [selectedLetter, setSelectedLetter] = useState('offer');
    console.log(propOfDataFromOfferForm);
    

    return (
        <div>
            <div className="issuelettersbuttondivmain">
            <Button type="primary" className='mr-5' onClick={() => setSelectedLetter('offer')}>
                Offer Letter
            </Button>
            <Button type="primary" onClick={() => setSelectedLetter('appointment')}>
                Appointment Letter
            </Button>
            </div>
          

            {selectedLetter === 'offer' && <OfferLetter />}
            {selectedLetter === 'appointment' && <AppointmentLetter />}
        </div>
    );
};

export default IssueOfferLetter;
