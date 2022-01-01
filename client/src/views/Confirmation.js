import React, {useState} from 'react';
import {Container} from "react-bootstrap";
import {useLocation} from "react-router-dom";
import css from './styles/Confirmation.module.css';
import TripSummary from "../common/TripSummary";


const Confirmation = () => {

    const location = useLocation();

    const [qrImg, setQrImg] = useState("")

    const {tripInfo, QR_CODE} = location.state;

    const reader = new FileReader();

    reader.onloadend = () => {
        setQrImg(reader.result);
    };
    reader.readAsDataURL(QR_CODE);

    const {
        arrivalTime, departureTime, destination,
        numberOfPassengers, source, totalPrice, seatInfo
    } = tripInfo;


    return (
        <Container className={css.Confirmation__content}>
            <TripSummary
                arrivalTime={arrivalTime}
                departureTime={departureTime}
                source={source}
                destination={destination}
                numberOfPassengers={numberOfPassengers}
                totalPrice={totalPrice}
                seatInfo={seatInfo}
                title="Confirmation"
                button={
                    <img
                        src={qrImg}
                        width={150}
                        alt="QR code for ticket validation"
                    />
                }
            />
        </Container>
    );
};

export default Confirmation;
