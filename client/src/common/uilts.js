import moment from "moment";
import {Card} from "react-bootstrap";
import React from "react";

export const formatDateToTime = (date) => moment(date).format('HH:mm');

export const formatDate = (date) => moment(date).format('ll');

export const showSeatInfo = (seatInfo) => {
    return (
        seatInfo.map(({number, row}, index) =>
            <Card.Text key={index}>
                {`Seat number: ${number}${row}`}
            </Card.Text>
        )
    )
}