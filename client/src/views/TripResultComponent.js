import React, {useEffect, useState} from 'react';
import {useHistory} from "react-router-dom";
import {Button, Card, Col, Row} from "react-bootstrap";
import css from "./styles/TripResultComponent.module.css";
import {formatDateToTime} from "../common/uilts";

const TripResultComponent = ({numberOfPassengers, hits}) => {

    let history = useHistory();

    const [selected, setSelected] = useState({});

    useEffect(() => {
        if (JSON.stringify(selected) !== '{}') history.push("/seatmap", selected);
    }, [selected, numberOfPassengers, hits, history])

    const handleSelectTrip = (
        arrivalTime, departureTime, destination, lineNumber, platform, price, source
    ) => {

        setSelected({
            arrivalTime, departureTime, destination, lineNumber,
            numberOfPassengers, platform, price, source
        });
    }


    const createSearchHitRows = () => {
        return hits.map(({
                             source, destination, lineRef, price
                         }, index) => (
            <Card className={`mb-2 ${css.TripResultComponent__card}`} key={index}>
                <Card.Body>
                    <Row>
                        <Col>
                            <Row className="ms-1">
                                {source.stopPointName}
                            </Row>
                            <Row className="ms-0">
                                {formatDateToTime(source.aimedArrivalTime)}
                            </Row>
                        </Col>
                        <Col>
                            <Row className="ms-1">
                                {destination.stopPointName}
                            </Row>
                            <Row className="ms-1">
                                {formatDateToTime(destination.aimedArrivalTime)}
                            </Row>
                        </Col>
                        <Col>
                            {lineRef}
                        </Col>
                        <Col>
                            {source.arrivalPlatformName}
                        </Col>
                        <Col>
                            <Button
                                variant="secondary"
                                onClick={() => handleSelectTrip(
                                    source.aimedArrivalTime, destination.aimedArrivalTime, destination.stopPointName, lineRef,
                                    source.arrivalPlatformName, price, source.stopPointName
                                )}
                            >
                                {`${price} NOK`}
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>

            </Card>

        ))
    }

    return (
        <div className="mt-5">
            <Card className="mb-2">
                <Card.Body>
                    <Row className={css.TripResultComponent__headerRow}>
                        <Col>
                            Departure
                        </Col>
                        <Col>
                            Arrival
                        </Col>
                        <Col>
                            Train
                        </Col>
                        <Col>
                            Track
                        </Col>
                        <Col/>
                    </Row>
                </Card.Body>
            </Card>
            {createSearchHitRows()}
        </div>
    );
};

export default TripResultComponent;
