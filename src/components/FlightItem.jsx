import classes from './FlightItem.module.css';

const FlightItem = props => {
  let flight = props.flight;

  return (
    <>
    <div className={classes.container}>
      <h3 className={classes.flightNo}>Flight {flight['flight_iata']}</h3>
      <div className={classes.airports}>
        <p>Going from <b>{flight['dep_iata']}</b> to <b>{flight['arr_iata']}</b></p>
      </div>
      <p className={classes.status}>Is {flight['status']}</p>
    </div>
    <hr></hr>
    </>
  )
};

export default FlightItem;