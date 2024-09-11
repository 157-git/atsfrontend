import React, { useEffect, useState } from 'react';
import BirthdayPage from './BirthdayPage'; // Adjust the path if needed
import './bday.css'
import { API_BASE_URL } from "../api/api";

const Bday = () => {
  const [messages, setMessages] = useState([]); // State for messages
  const [recruiters, setRecruiters] = useState([]); // State for recruiters data
  const [isBirthday, setIsBirthday] = useState(false); // State to track if it's a birthday
  const [birthdayRecruiter, setBirthdayRecruiter] = useState(null); // State to store birthday recruiter's name

  useEffect(() => {
    const fetchRecruiters = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/fetch-profile-details/1/Recruiters`);
        const data = await response.json();

        // Check if the API response is an array or a single object
        if (Array.isArray(data)) {
          setRecruiters(data);
        } else if (typeof data === 'object' && data !== null) {
          // Handle case where API returns a single object instead of an array
          setRecruiters([data]);
        } else {
          console.error('API response is not valid:', data);
          setRecruiters([]);
        }
      } catch (error) {
        console.error('Error fetching recruiter data:', error);
        setRecruiters([]);
      }
    };

    fetchRecruiters();
  }, []);

  useEffect(() => {
    const today = new Date();
    const currentMonthDay = `${today.getMonth() + 1}-${today.getDate()}`;

    if (Array.isArray(recruiters)) {
      const newMessages = recruiters
        .map((recruiter) => {
        
          const recruiterBirthday = recruiter.dateOfBirth.split('T')[0]; // Assuming 'yyyy-MM-dd' format
          const recruiterAnniversary = recruiter.anniversaryDate.split('T')[0]; // Assuming 'yyyy-MM-dd' format

          // Extracting MM-DD from 'yyyy-MM-dd' format
          const formattedBirthday = `${recruiterBirthday.slice(5, 7)}-${recruiterBirthday.slice(8, 10)}`; // MM-DD
          const formattedAnniversary = `${recruiterAnniversary.slice(5, 7)}-${recruiterAnniversary.slice(8, 10)}`; // MM-DD
        
          
          if (formattedBirthday === currentMonthDay) {
            setIsBirthday(true);
            setBirthdayRecruiter(recruiter.name);
            return `Happy Birthday, ${recruiter.name}!`;
           
          } else if (formattedAnniversary === currentMonthDay) {
            return `Happy Anniversary, ${recruiter.name}!`;
          }
          return null;
        })
        .filter((message) => message !== null);
      setMessages(newMessages);
    } else {
      console.error('Recruiters data is not an array:', recruiters);
    }
  }, [recruiters]);

  if (recruiters) {
    return <BirthdayPage name={birthdayRecruiter} />;
  }

  return (
    <div className="bday-container">
      <h1>Recruiter Notifications</h1>
      {messages.length > 0 ? (
        messages.map((message, index) => <p key={index}>{message}</p>)
      ) : (
        <p>No notifications for today.</p>
      )}
    </div>
  );
};

export default Bday;
