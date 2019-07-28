import React from 'react';
import dominoLogo from '../../assets/logo2.png';
import './Logo.css';

const logo = (props) => (
    <div className="Logo">
        <img src={dominoLogo} alt="logo" />
    </div>
);

export default logo;