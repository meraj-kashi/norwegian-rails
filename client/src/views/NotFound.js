import React from 'react';
import {Alert} from "react-bootstrap";

const NotFound = () => {
    return (
        <Alert variant="danger">
            <Alert.Heading>404 NOT FOUND</Alert.Heading>
            <p>
                Ouch! Looks like we can't find what you are trying to access.
            </p>
        </Alert>
    );
};

export default NotFound;