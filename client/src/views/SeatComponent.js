import React, {useState} from 'react';
import {Button, Card, Col, Container, Row} from "react-bootstrap";
import {useHistory, useLocation} from "react-router-dom";
import {SeatPicker} from "../seatmap/SeatPicker";
import css from './styles/SeatComponent.module.css';
import {formatDate, formatDateToTime, showSeatInfo} from "../common/uilts";

const SeatComponent = () => {

    let history = useHistory();
    const location = useLocation();

    const [seatInfo, setSeatInfo] = useState([]);
    const tripInfo = location.state;

    const {
        arrivalTime, departureTime, destination,
        numberOfPassengers, price, source
    } = location.state;

    const calculatePrice = () => Number(price) * numberOfPassengers;


    const handleGoToPayment = () => {
        if (JSON.stringify(seatInfo) !== '{}') {
            history.push("/payment", {...tripInfo, totalPrice: calculatePrice(), seatInfo});
        }
    }

    const addSeatCallback = ({row, number, id}, addCb) => {
        const newTooltip = `Reverved by you`;
        addCb(row, number, id, newTooltip);
        setSeatInfo([...seatInfo, {row, number, id}])
    };

    const removeSeatCallback = ({row, number, id}, removeCb) => {
        const newTooltip = ["A", "B", "C", "D", "E"].includes(row) ? null : "";
        removeCb(row, number, newTooltip);

        const newSeatInfo = seatInfo.filter((item) => item.id !== id);
        setSeatInfo(newSeatInfo);
    };

    const rows = [
        [
            {id: 1, number: 1},
            {id: 2, number: 2},
            null,
            {id: 3, number: 3, isReserved: true},
            {id: 4, number: 4},
            null,
            {id: 5, number: 5},
            {id: 6, number: 6},
        ],
        [
            {
                id: 7,
                number: 1,
                isReserved: true
            },
            {id: 8, number: 2, isReserved: true},
            null,
            {id: 9, number: 3, isReserved: true},
            {id: 10, number: 4},
            null,
            {id: 11, number: 5},
            {id: 12, number: 6},
        ],
        [
            {id: 13, number: 1},
            {id: 14, number: 2},
            null,
            {id: 15, number: 3, isReserved: true},
            {id: 16, number: 4},
            null,
            {id: 17, number: 5},
            {id: 18, number: 6},
        ],
        [
            {id: 19, number: 1},
            {id: 20, number: 2},
            null,
            {id: 21, number: 3},
            {id: 22, number: 4},
            null,
            {id: 23, number: 5},
            {id: 24, number: 6},
        ],
        [
            {id: 25, number: 1, isReserved: true},
            {id: 26, number: 2},
            null,
            {id: 27, number: 3, isReserved: true},
            {id: 28, number: 4},
            null,
            {id: 29, number: 5},
            {id: 30, number: 6},
        ],
    ];

    return (
        <Container className={css.SeatComponent__container}>
            <Row md={2}>
                <Card as={Col} className={`text-center ${css.SeatComponent__card}`}>
                    <Card.Header className={css.SeatComponent__cardHeader}>Reserve your seat(s)</Card.Header>
                    <Card.Body>
                        <SeatPicker
                            addSeatCallback={addSeatCallback}
                            removeSeatCallback={removeSeatCallback}
                            rows={rows}
                            maxReservableSeats={Number(numberOfPassengers)}
                            alpha
                            visible
                            selectedByDefault
                            tooltipProps={{multiline: true}}/>
                    </Card.Body>
                </Card>
                    <Card className={`text-center ${css.SeatComponent__card}`}>
                        <Card.Header
                            className={css.SeatComponent__cardHeader}>
                            Summary
                        </Card.Header>
                        <Card.Body>
                            <Card.Text>
                                {`${source} - ${destination}`}
                            </Card.Text>
                            <Card.Text>
                                {`${formatDate(departureTime)},
                             ${formatDateToTime(departureTime)} - ${formatDateToTime(arrivalTime)}`}
                            </Card.Text>
                            <Card.Text>
                                Your seat(s)
                            </Card.Text>
                            {showSeatInfo(seatInfo)}
                            <Card.Text>
                                {`Total price ${calculatePrice()} NOK `}
                            </Card.Text>
                            <Button
                                variant="success"
                                onClick={() => handleGoToPayment()}
                            >
                                Go to payment
                            </Button>
                        </Card.Body>
                    </Card>
            </Row>
        </Container>
    );
};

export default SeatComponent;
