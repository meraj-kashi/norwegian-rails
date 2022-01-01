import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import css from './SearchContainer.module.css';
import {searchForTrip} from "../services/search";


const SearchContainer = ({isLoading, setIsLoading, setHits, setNumberOfPassengers}) => {
    const [addReturn, setAddReturn] = useState(false);
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({})

    useEffect(() => {
    }, [errors, formData]);

    const findFormErrors = () => {
        const {fromLocation, toLocation, departureDate, arrivalDate} = formData;
        const newErrors = {};

        if (!fromLocation || fromLocation === '') newErrors.fromLocation = 'This field cannot be blank';
        if (!toLocation || toLocation === '') newErrors.toLocation = 'This field cannot be blank';
        if (!departureDate || departureDate === '') newErrors.outDate = 'This field cannot be blank';
        if (addReturn && (!arrivalDate || arrivalDate === '')) newErrors.returnDate = 'This field cannot be blank';
        if (arrivalDate < departureDate) newErrors.returnDate = 'Return date must be after out date'

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

    const search = () => {
        const newErrors = findFormErrors()

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)

        } else {
            setIsLoading(true)
            searchForTrip({
                departure: formData.fromLocation, destination: formData.toLocation,
                departureDate: formData.departureDate, arrivalDate: formData.arrivalDate
            }).then(res =>
            {
                setHits(res)
                setIsLoading(false)
            })
        }
    }

    return (
        <Card className={`mt-5 ${css.SearchContainer__card}`}>
            <Card.Header className={css.SearchContainer__cardHeader}>Where do you want to go?</Card.Header>
            <Card.Body>
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col}>
                            <Form.Label id="fromLocation">From</Form.Label>
                            <Form.Control
                                isInvalid={!!errors.fromLocation}
                                aria-labelledby="fromLocation"
                                onChange={(e) =>
                                    setField('fromLocation', e.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.fromLocation}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label id="toLocation">To</Form.Label>
                            <Form.Control
                                isInvalid={!!errors.toLocation}
                                aria-labelledby="toLocation"
                                onChange={(e) =>
                                    setField('toLocation', e.target.value)}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.toLocation}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row>
                        <Form.Group as={Col} sm={1}>
                            <Form.Label id="addReturn">Return</Form.Label>
                            <Form.Check
                                type="checkbox"
                                aria-labelledby="addReturn"
                                onClick={() => setAddReturn(!addReturn)}
                            />
                        </Form.Group>

                        <Form.Group as={Col} md={3}>
                            <Form.Label id="departureDate">Departure date</Form.Label>
                            <Form.Control
                                isInvalid={!!errors.outDate}
                                aria-labelledby="departureDate"
                                type="date"
                                onChange={(e) =>
                                    setField('departureDate', e.target.value)}/>
                            <Form.Control.Feedback type='invalid'>
                                {errors.outDate}
                            </Form.Control.Feedback>
                        </Form.Group>

                        {
                            addReturn &&
                            <Form.Group as={Col} md={3}>
                                <Form.Label id="arrivalDate">Return date</Form.Label>
                                <Form.Control
                                    type="date"
                                    isInvalid={!!errors.returnDate}
                                    aria-labelledby="arrivalDate"
                                    onChange={(e) =>
                                        setField('arrivalDate', e.target.value)}
                                />
                                <Form.Control.Feedback
                                    type='invalid'>
                                    {errors.returnDate}
                                </Form.Control.Feedback>
                            </Form.Group>
                        }

                        <Form.Group as={Col} md={3}>
                            <Form.Label>No. of passengers</Form.Label>
                            <Form.Select onChange={(e) => {
                                setNumberOfPassengers(e.target.value)
                            }}
                                         aria-label="Select number of passengers">
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                            </Form.Select>
                        </Form.Group>

                        <Col style={{paddingTop: '2rem'}}>
                            <Form.Group as={Col}>
                                <Button
                                    variant="success"
                                    onClick={() => search()}
                                >Search</Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default SearchContainer;
