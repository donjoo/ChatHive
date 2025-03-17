"use client";

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

function Chatpag() {
    const reduxState = useSelector((state) => state); // Get full state
    const currentUser = reduxState.auth?.user; // Access user

    console.log(reduxState, 'Full Redux State'); // Log everything
    console.log(currentUser, 'currentUser in Chatpag');

    useEffect(() => {
        console.log(currentUser, 'currentUser inside useEffect');
    }, [currentUser]);

    return <p>{currentUser ? currentUser.username : "No user found"}</p>;
}

export default Chatpag;
