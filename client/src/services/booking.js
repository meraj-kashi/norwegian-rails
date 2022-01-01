import axios from "axios";
import * as AxiosLogger from 'axios-logger';

axios.interceptors.request.use(AxiosLogger.requestLogger);
axios.interceptors.response.use(AxiosLogger.responseLogger);

export const bookTicket = (data) => axios.post('/booking',
    {data}, {
    responseType: "blob"
    }).then(res => res.data);

export const confirmPayment = (paymentInfo) => {
    axios.post("/payment", {data: paymentInfo}).then(r => r.status).catch(err => err);
}