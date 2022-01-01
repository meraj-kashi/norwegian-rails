import React, {useEffect, useState} from 'react';
import SearchContainer from "../search/SearchContainer";
import css from "./styles/TripComponent.module.css";
import TripResultComponent from "./TripResultComponent";
import {Spinner} from "react-bootstrap";

const TripComponent = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [hits, setHits] = useState(null)
    const [numberOfPassengers, setNumberOfPassengers] = useState(1)


    useEffect(() => {

    }, [hits, isLoading])

    return (
        <div className={css.TripComponent}>
            <SearchContainer
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setHits={setHits}
                setNumberOfPassengers={setNumberOfPassengers}
            />
            {isLoading ?
                <Spinner className="mt-5" animation="border"/> :
                hits && <TripResultComponent
                    numberOfPassengers={numberOfPassengers}
                    hits={hits}
                />
            }
        </div>
    );
};

export default TripComponent;
