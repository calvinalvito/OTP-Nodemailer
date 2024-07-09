// src/components/App.tsx
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const App: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationResult, setVerificationResult] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false); 

  const handleSendOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/send-otp', { email });
      console.log(response.data);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/validate-otp', { otp, email });
      console.log(response.data);
      if (response.data.valid) {
        setVerificationResult('OTP is valid!');
        setShowSuccessPopup(true); 
      } else {
        setVerificationResult('OTP is not valid!');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  const closePopup = () => {
    setShowSuccessPopup(false);
  };

  return (
    <div className='App'>
      <h1>OTP Verification App</h1>
      <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSendOtp}>Send OTP</button>

      <br />

      <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
      <button onClick={handleVerifyOtp}>Verify OTP</button>

      <br />

      {verificationResult && <p>{verificationResult}</p>}

      {showSuccessPopup && (
        <div className="success-popup">
          <p>Verification successful!</p>
          <button onClick={closePopup}>Close</button>
        </div>
      )}
    </div>
  );
};

export default App;
