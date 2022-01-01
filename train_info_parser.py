import random
from xml.etree import ElementTree

import requests


def train_info(source, destination, start_date, end_date):
    url = f'https://siri.opm.jbv.no/jbv/pt/production-timetable.xml?ValidityPeriod.StartTime={start_date}&ValidityPeriod.EndTime={end_date}&Lines.LineDirection.DirectionRef={destination}'
    response = requests.get(url)
    root = ElementTree.fromstring(response.content)

    dict = {}
    dict_source = {}
    dict_dest = {}
    dict_via = {}
    list_via = {}
    dict_main = {}

    for i, elem in enumerate(root.iter('{http://www.siri.org.uk/siri}DatedTimetableVersionFrame')):
        LineRef = elem.find('{http://www.siri.org.uk/siri}LineRef')
        dict['lineRef'] = LineRef.text
        DirectionRef = elem.find('{http://www.siri.org.uk/siri}DirectionRef')
        dict['directionRef'] = DirectionRef.text
        OperatorRef = elem.find('{http://www.siri.org.uk/siri}OperatorRef')
        dict['operatorRef'] = OperatorRef.text

        list_of_stops = {}
        for idxx, j in enumerate(elem.iter('{http://www.siri.org.uk/siri}DatedVehicleJourney')):
            DatedCalls = (j.find('{http://www.siri.org.uk/siri}DatedCalls'))
            total_Calls = (len(DatedCalls))
            for idx, k in enumerate(DatedCalls.iter('{http://www.siri.org.uk/siri}DatedCall')):
                if idx == 0:
                    StopPointRef = k.find('{http://www.siri.org.uk/siri}StopPointRef')
                    StopPointName = k.find('{http://www.siri.org.uk/siri}StopPointName')
                    AimedDepartureTime = k.find('{http://www.siri.org.uk/siri}AimedDepartureTime')
                    DeparturePlatformName = k.find('{http://www.siri.org.uk/siri}DeparturePlatformName')

                    dict_source['stopPointRef'] = StopPointRef.text
                    dict_source['stopPointName'] = StopPointName.text
                    dict_source['aimedDepartureTime'] = AimedDepartureTime.text
                    dict_source['departurePlatformName'] = DeparturePlatformName.text
                    list_of_stops['source'] = dict_source
                elif idx == total_Calls - 1:
                    # DatedCall = k.find('{http://www.siri.org.uk/siri}DatedCall')
                    StopPointRef = k.find('{http://www.siri.org.uk/siri}StopPointRef')
                    StopPointName = k.find('{http://www.siri.org.uk/siri}StopPointName')
                    AimedArrivalTime = k.find('{http://www.siri.org.uk/siri}AimedArrivalTime')
                    ArrivalPlatformName = k.find('{http://www.siri.org.uk/siri}ArrivalPlatformName')

                    dict_dest['stopPointRef'] = StopPointRef.text
                    dict_dest['stopPointName'] = StopPointName.text
                    dict_dest['aimedArrivalTime'] = AimedArrivalTime.text
                    dict_dest['arrivalPlatformName'] = ArrivalPlatformName.text
                    list_of_stops['destination'] = dict_dest
                else:
                    StopPointRef = k.find('{http://www.siri.org.uk/siri}StopPointRef')
                    StopPointName = k.find('{http://www.siri.org.uk/siri}StopPointName')
                    AimedArrivalTime = k.find('{http://www.siri.org.uk/siri}AimedArrivalTime')
                    ArrivalPlatformName = k.find('{http://www.siri.org.uk/siri}ArrivalPlatformName')

                    dict_via['stopPointRef'] = StopPointRef.text
                    dict_via['stopPointName'] = StopPointName.text
                    dict_via['aimedArrivalTime'] = AimedArrivalTime.text
                    dict_via['arrivalPlatformName'] = ArrivalPlatformName.text
                    list_via[idx] = dict_via
                    dict_via = {}
                list_of_stops['via'] = list_via

                dict['list_of_stops'] = list_of_stops

            dict_main[i] = dict
            dict = {}
            list_of_stops = {}
            dict_dest = {}
            dict_source = {}

    result = {}
    final = {}
    for i in dict_main:
        if source in dict_main[i]['list_of_stops']['source']['stopPointName']:
            result['source'] = dict_main[i]['list_of_stops']['source']
            result['lineRef'] = dict_main[i]['lineRef']
            result['operatorRef'] = dict_main[i]['operatorRef']
        else:
            for j in dict_main[i]['list_of_stops']['via']:
                if source in dict_main[i]['list_of_stops']['via'][j]['stopPointName']:
                    result['source'] = dict_main[i]['list_of_stops']['via'][j]
                    result['lineRef'] = dict_main[i]['lineRef']
                    result['operatorRef'] = dict_main[i]['operatorRef']

        if destination in dict_main[i]['list_of_stops']['destination']['stopPointRef']:
            result['destination'] = dict_main[i]['list_of_stops']['destination']
            result['price'] = random.randint(449, 1099)

        final[i] = result
        result = {}
    return list(final.values())
