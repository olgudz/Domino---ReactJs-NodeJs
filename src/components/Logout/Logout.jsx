import React from 'react';

import './Logout.css';

const logout = (props) => (
    <button className="Logout" onClick={props.click}>
        Logout
    </button>
);

export default logout;