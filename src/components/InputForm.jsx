import { useRef } from 'react';
import axios from 'axios';
import classes from './InputForm.module.css';

const API_KEY = `18068ca8-7d19-4cc2-bd93-0e8c5ade6c22`;
const BASE_URL = `https://airlabs.co/api/v9/flights?api_key=${API_KEY}`;

const InputForm = props => {
  const [airlineRef, flightNoRef, departedFromRef, arrivingAtRef, 
    flightStatusRef, latRef, longRef] = 
      Array(7).fill(null).map(() => useRef(null));

  const buildApiQuery = () => {
    const refByApiParamName = {
      airline_iata: airlineRef.current.value || null,
      flight_iata: flightNoRef.current.value || null,
      dep_iata: departedFromRef.current.value || null,
      arr_iata: arrivingAtRef.current.value || null
    };

    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(refByApiParamName)) {
      if (value) {
        query.append(key, value);
      }
    }

    return `${BASE_URL}&${query.toString()}`;
  };
  
  const getFlightsFromAPI = () => {
    return axios.get(buildApiQuery())
      .then(response => {
        let flights = response.data.response;
        let filteredFlights = flights;

        if (flightStatusRef.current.value && flightStatusRef.current.value !== 'default') {
          const flightStatusFilter = flightStatusRef.current.value;
          filteredFlights = flights.filter(flight => flight['status'] === flightStatusFilter);
        }

        let finalFlightsList = filteredFlights;
        if (latRef.current.value && longRef.current.value) {
          finalFlightsList = filteredFlights.filter(flight => {
            return flight['lat'] == latRef.current.value && 
              flight['lng'] == longRef.current.value;
          })
        }

        return finalFlightsList;
      }).catch(error => {
        console.error('There was an error in the API call: ', error);
      });
  };

  const submitHandler = e => {
    e.preventDefault();

    getFlightsFromAPI()
      .then(flights => props.displayFlights(flights));
  };

  return (
    <form onSubmit={submitHandler}>
      <div className={classes.rowOne}>
        <input type='text' placeholder='Airline Code (Eg. DL, AA)' ref={airlineRef}/>
        <input type='text' placeholder='Flight Number (Eg. DL345)' ref={flightNoRef}/>
      </div>
      <div className={classes.rowTwo}>
        <input type='text' placeholder='Departure Airport (Eg. IAD)' ref={departedFromRef}/>
        <input type='text' placeholder='Arrival Airport (Eg. PHL)' ref={arrivingAtRef}/>
      </div>
      <div className={classes.rowThree}>
        <select name='status' ref={flightStatusRef}>
          <option value='default' defaultValue> --Flight Status --</option>
          <option value='scheduled'>Scheduled</option>
          <option value='en-route'>En-route</option>
          <option value='landed'>Landed</option>
        </select>
        <input type='text' placeholder='Current Latitude' ref={latRef}/>
        <input type='text' placeholder='Current Longitude' ref={longRef}/> 
      </div>
      <button>Find Flights</button>
    </form>    
  )
};

export default InputForm;