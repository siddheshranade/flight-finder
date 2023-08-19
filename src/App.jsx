import styles from './App.module.css'
import { useState } from 'react';
import InputForm from './components/InputForm';
import FlightItem from './components/FlightItem';

function App() {
  let [flightsToDisplay, setFlightsToDisplay] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const totalPages = flightsToDisplay ? Math.ceil(flightsToDisplay.length / itemsPerPage) : 0;
  const flightsToRender = flightsToDisplay ? 
    flightsToDisplay.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
    : [];

  return (
    <div className={styles.backgroundContainer }>
      <div className={styles.parentContainer}>
        <div className={styles.formContainer}>
          <h1>Flight Finder</h1>
          <h3>Your Gateway to Real-Time Flight Tracking!</h3>
          <p>Search for flights by:</p>
          <InputForm displayFlights={flights => setFlightsToDisplay(flights)} />
        </div>
        <div className={styles.flightsListContainer}>
        {flightsToRender && flightsToRender.map((flight, index) => (
          <FlightItem key={index} flight={flight} />
        ))}
        </div>
        <div className={styles.pagination}>
        {flightsToDisplay && flightsToDisplay.length > itemsPerPage && (
          <div>
            <button disabled={currentPage === 0} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <button disabled={currentPage === totalPages - 1} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        )}
        </div>
      </div>
    </div>
  )
}

export default App;