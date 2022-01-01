import axios from "axios";


export const searchForTrip = ({departure, destination, departureDate, arrivalDate}) => {
    const departureDateTime = departureDate + "T06:00:00Z";
    let arrivalDateTime;

    if (arrivalDate) {
        arrivalDateTime = arrivalDate + "T06:00:00Z";
    } else {
        arrivalDateTime = departureDate + "T07:00:00Z";
    }
    return axios.get(`/search?departure=${departure}&destination=${destination}&departureDate=${departureDateTime}&arrivalDate=${arrivalDateTime}`)
        .then(res => res.data);
}