import React from 'react';
import {Card, Col} from "react-bootstrap";
import css from "../views/styles/Payment.module.css";
import {formatDate, formatDateToTime, showSeatInfo} from "./uilts";

const TripSummary = ({title, source, destination, departureTime, arrivalTime, seatInfo,
                         numberOfPassengers, totalPrice, button}) => {
    return (
        <Col md={3}>
            <Card className={css.Payment__card}>
                <Card.Header className={css.Payment__cardHeader}>
                    {title}
                </Card.Header>
                <Card.Body className={css.Payment__cardBody}>
                    <Card.Text>
                        {`${source} - ${destination}`}
                    </Card.Text>
                    <Card.Text>
                        {`${formatDate(departureTime)}, ${formatDateToTime(departureTime)} - ${formatDateToTime(arrivalTime)}`}
                    </Card.Text>
                    {showSeatInfo(seatInfo)}
                    <Card.Text className={css.Payment__noOfPassengers}>
                        {`${numberOfPassengers} traveller(s)`}
                    </Card.Text>
                    <Card.Text className={css.Payment__totalPrice}>
                        {`Total price ${totalPrice} NOK`}
                    </Card.Text>
                    {button}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default TripSummary;