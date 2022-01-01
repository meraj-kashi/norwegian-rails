import React, {useEffect, useState} from 'react';
import {Alert, Button, Card, Col, Form, Row} from "react-bootstrap";
import {useHistory, useLocation} from "react-router-dom";
import css from './styles/Payment.module.css';
import TripSummary from "../common/TripSummary";
import {bookTicket} from "../services/booking";

const Payment = () => {

    let history = useHistory();
    const location = useLocation();

    const {
        arrivalTime, departureTime, destination,
        numberOfPassengers, totalPrice, source, seatInfo
    } = location.state;

    const [formData, setFormData] = useState({})
    const tripInfo = location.state;
    const [errors, setErrors] = useState({})
    const [paymentFailed, setPaymentFailed] = useState(false)

    const handleCompletePurchase = async () => {
        const newErrors = findFormErrors()

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
        } else {
            const QR_CODE = await bookTicket({tripInfo, customerInfo: formData})
                .then((response => response))
                .catch(() => {
                    setPaymentFailed(true)
                });

            if (!paymentFailed) {
                history.push("/confirmation", {tripInfo, customerInfo: formData, QR_CODE})
            }
        }
    }

    const findFormErrors = () => {
        const {firstName, lastName, email, phoneNo, cardNumber, expiryDate, cvc, nameCardHolder} = formData;
        const newErrors = {};

        if (!firstName || firstName === '') newErrors.firstName = 'This field cannot be blank';
        if (!lastName || lastName === '') newErrors.lastName = 'This field cannot be blank';
        if (!email || email === '') newErrors.email = 'This field cannot be blank';
        if (!phoneNo || phoneNo === '') newErrors.phoneNo = 'This field cannot be blank';
        if (!cardNumber || cardNumber === '') newErrors.cardNumber = 'This field cannot be blank';
        if (!expiryDate || expiryDate === '') newErrors.expiryDate = 'This field cannot be blank';
        if (!cvc || cvc === '') newErrors.cvc = 'This field cannot be blank';
        if (!nameCardHolder || nameCardHolder === '') newErrors.nameCardHolder = 'This field cannot be blank';
        if (paymentFailed) newErrors.paymentFailed = 'Payment failed. Please try again later';

        return newErrors
    }

    const setField = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        })

        if (!!errors[field]) setErrors({
            ...errors,
            [field]: null
        })
    }


    return (
        <Row className={css.Payment__content} md={2}>
            <Col md={4}>
                <Card as={Col}>
                    <Card.Header className={css.Payment__cardHeader}>
                        Confirm and pay
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Row className="mb-3">
                                <Card.Text className={css.Payment__cardText}>Personal details</Card.Text>
                                <Form.Group as={Col}>
                                    <Form.Label id="firstName">First name</Form.Label>
                                    <Form.Control
                                        isInvalid={!!errors.firstName}
                                        aria-labelledby="firstName"
                                        onChange={(e) =>
                                            setField('firstName', e.target.value)}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.firstName}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label id="lastName">Last name</Form.Label>
                                    <Form.Control
                                        isInvalid={!!errors.lastName}
                                        aria-labelledby="lastName"
                                        onChange={(e) =>
                                            setField('lastName', e.target.value)}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.lastName}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col}>
                                    <Form.Label id="email">Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        isInvalid={!!errors.email}
                                        aria-labelledby="email"
                                        onChange={(e) =>
                                            setField('email', e.target.value)}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col}>
                                    <Form.Label id="phoneNumber">Phone number</Form.Label>
                                    <Form.Control
                                        isInvalid={!!errors.phoneNo}
                                        aria-labelledby="phoneNumber"
                                        onChange={(e) =>
                                            setField('phoneNo', e.target.value)}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.phoneNo}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            <Row className="mt-5">
                                <Card.Text className={css.Payment__cardText}>Payment Details</Card.Text>
                                <Form.Group as={Col} md={12}>
                                    <Form.Label id="cardNumber">Card number</Form.Label>
                                    <Form.Control
                                        isInvalid={!!errors.cardNumber}
                                        aria-labelledby="cardNumber"
                                        onChange={(e) =>
                                            setField('cardNumber', e.target.value)}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.cardNumber}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Row className="mt-3">
                                    <Form.Group as={Col} md={6}>
                                        <Form.Label id="expiryDate">Expiry date</Form.Label>
                                        <Form.Control
                                            isInvalid={!!errors.expiryDate}
                                            aria-labelledby="expiryDate"
                                            onChange={(e) =>
                                                setField('expiryDate', e.target.value)}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.expiryDate}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md={6}>
                                        <Form.Label id="cvc">CVC/CVV</Form.Label>
                                        <Form.Control
                                            isInvalid={!!errors.cvc}
                                            aria-labelledby="cvc"
                                            onChange={(e) =>
                                                setField('cvc', e.target.value)}
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            {errors.cvc}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Form.Group
                                    className="mt-3"
                                    as={Col}
                                    md={12}>
                                    <Form.Label id="cardName">Name on card</Form.Label>
                                    <Form.Control
                                        isInvalid={!!errors.nameCardHolder}
                                        aria-labelledby="cardName"
                                        onChange={(e) =>
                                            setField('nameCardHolder', e.target.value)}
                                    />
                                    <Form.Control.Feedback type='invalid'>
                                        {errors.nameCardHolder}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <TripSummary
                arrivalTime={arrivalTime}
                departureTime={departureTime}
                source={source}
                destination={destination}
                numberOfPassengers={numberOfPassengers}
                totalPrice={totalPrice}
                seatInfo={seatInfo}
                title="Trip summary"
                button={
                    <Col className="mt-auto">
                        {paymentFailed &&
                        <Alert variant="danger">
                            Something went wrong during booking. Please try again later.
                        </Alert>}
                        <Button
                            variant="success"
                            onClick={() => handleCompletePurchase()}
                        >Complete</Button>
                    </Col>}
            />
        </Row>
    );
};

export default Payment;
