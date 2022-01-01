import asyncio
import json
from io import BytesIO

import qrcode
from flask import Flask, send_from_directory, Response, request, send_file
from pymodm import MongoModel, fields, connect, EmbeddedMongoModel
from pymongo import MongoClient

import creds
import train_info_parser


app = Flask(__name__, static_folder='client/build', static_url_path='')

db_username = creds.db_connection["db_username"]
db_password = creds.db_connection["db_password"]
mongodb_srv = f"mongodb+srv://{db_username}:{db_password}@cluster0.dwcri.mongodb.net/railway_norway?retryWrites=true&w=majority"

try:
    mongo = MongoClient(mongodb_srv)
    db = mongo["railway_norway"]
    mongo.server_info()
except ConnectionError:
    app.logger.info("ERROR - Cannot connect to db", ConnectionError)

connect(mongodb_srv)


class Seat(EmbeddedMongoModel):
    id = fields.ObjectId()
    isAvailable = fields.BooleanField()
    row = fields.CharField()
    number = fields.IntegerField()
    wagon = fields.IntegerField()


class Customer(EmbeddedMongoModel):
    id = fields.ObjectId()
    firstName = fields.CharField()
    lastName = fields.CharField()
    email = fields.EmailField()
    phoneNo = fields.BigIntegerField()


class Payment(EmbeddedMongoModel):
    id = fields.ObjectId()
    cardNumber = fields.BigIntegerField()
    cardHolderName = fields.CharField()
    cvc = fields.IntegerField()
    customer_id = fields.ReferenceField(Customer)
    price = fields.IntegerField()
    status = fields.CharField()


class Trip(MongoModel):
    id = fields.ObjectId()
    status = fields.CharField()
    seats = fields.ListField(fields.EmbeddedDocumentField(Seat))
    fromLocation = fields.CharField()
    toLocation = fields.CharField()
    startTime = fields.DateTimeField()
    arrivalTime = fields.DateTimeField()
    customer = fields.EmbeddedDocumentField(Customer)
    payment = fields.EmbeddedDocumentField(Payment)


async def train_lookup(source, destination, start_date, end_date):
    data = train_info_parser.train_info(source, destination, start_date, end_date)
    await asyncio.sleep(5)
    return data


def station_name_to_ref(stationName):
    station_col = db["station_mapping"]
    query = {"StopPointName": stationName.capitalize()}
    stationRef = station_col.find(query)
    return stationRef[0]['StopPointRef']


def generate_qr():
    img = qrcode.make('Valid ticket!')
    type(img)
    img.save("ticket.png")
    return img


@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')


@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/booking', methods=["POST"])
def create_booking():
    app.logger.info('Start booking ticket')

    try:
        args = request.get_json().get("data")
        tripInfo = args.get("tripInfo")
        customerInfo = args.get("customerInfo")
        seats = tripInfo.get("seatInfo")

        seat_list = []

        for seat in seats:
            new_seat = Seat(isAvailable=False, row=seat.get("row"), number=seat.get("number"),
                            wagon=4)
            seat_list.append(new_seat)

        customer = Customer(firstName=customerInfo.get("firstName"),
                            lastName=customerInfo.get("lastName"),
                            email=customerInfo.get("email"),
                            phoneNo=customerInfo.get("phoneNo"))

        payment = Payment(cardNumber=customerInfo.get("cardNumber"),
                          cardHolderName=customerInfo.get("nameCardHolder"),
                          cvc=customerInfo.get("cvc"),
                          price=tripInfo.get("totalPrice"),
                          status="PAID")

        trip = Trip(status="ACTIVE", seats=seat_list,
                    fromLocation=tripInfo.get("source"), toLocation=tripInfo.get("destination"),
                    startTime=tripInfo.get("departureTime"), arrivalTime=tripInfo.get("arrivalTime"),
                    customer=customer, payment=payment).save()

        buffer = BytesIO()
        img = qrcode.make('Valid ticket!')
        img.save(buffer)
        buffer.seek(0)

        app.logger.info('Booking completed')

        response = send_file(buffer, mimetype="image/png")
        return response

    except Exception as ex:
        app.logger.info('Booking failed', ex)
        return Response(
            response=json.dumps({"message": "Booking failed"}),
            status=500,
            mimetype="application/json"
        )


@app.route('/search', methods=["GET"])
def search_for_trips():
    app.logger.info('%s Searching for trips', request.get_json())
    try:
        args = request.args

        departure = args.get("departure").capitalize()
        destination = station_name_to_ref(args.get("destination"))
        departureDate = args.get("departureDate")
        arrivalDate = args.get("arrivalDate")

        asyncio.set_event_loop(asyncio.new_event_loop())
        loop = asyncio.get_event_loop()
        data = loop.run_until_complete(train_lookup(departure, destination, departureDate, arrivalDate))

        return Response(
            response=json.dumps(data),
            status=200,
            mimetype="application/json")
    except Exception as ex:
        app.logger.info('Search for trip failed', ex)
        return Response(
            response=json.dumps({"message": "Search for trips failed"}),
            status=500,
            mimetype="application/json"
        )


@app.route("/ping")
def ping():
    return "Hello from Flask server!"


if __name__ == "__main__":
    app.run(debug=True)
