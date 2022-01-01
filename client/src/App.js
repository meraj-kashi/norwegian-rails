import Header from "./common/header";
import TripComponent from "./views/TripComponent";
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";
import SeatComponent from "./views/SeatComponent";
import Payment from "./views/Payment";
import 'bootstrap/dist/css/bootstrap.min.css';
import Confirmation from "./views/Confirmation";
import NotFound from "./views/NotFound";
import './seatmap/styles/index.scss';

function App() {

    return (
        <Router>
            <Header/>
            <Switch>
                <Route exact path="/">
                    <TripComponent/>
                </Route>
                <Route exact path="/seatmap">
                    <SeatComponent />
                </Route>
                <Route exact path="/payment">
                    <Payment />
                </Route>
                <Route exact path="/confirmation">
                    <Confirmation />
                </Route>
                <Route exact path="/update">
                    <Confirmation />
                </Route>
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
}

export default App;
