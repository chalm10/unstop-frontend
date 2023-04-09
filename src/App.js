import React, { useState, useEffect } from "react";
import "./App.css";
import TrainCoach from "./components/TrainCoach";
import ReserveSeats, {
  currentBookedSeats,
  resetAvailableNoOfSeatsRowWise,
  initialiseAvailableNoOfSeatsRowWise,
  initialiseBookedSeats,
  totalBookedSeats,
} from "./helper/SeatBooker";
import { BASE_URL} from "./helper/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faSync } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [inputSeats, setInputSeats] = useState("");
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [toggle, setToggle] = useState(false);
  const _currentBookedSeats = [...currentBookedSeats];
  const availableSeats = 80 - totalBookedSeats.size;

  useEffect(() => {
    if (error !== "") {
      window.alert(error);
    }
  }, [error]);

  useEffect(() => {
    getAvailableSeatsRowWise();
    getBookedSeats();
  }, []);


  // gets and sets my available seats array on first run from database -> 
  // [7,7,7,7,7,7,7,7,7,7,7,3] initially -> index depicts row and value depicts available seats
  const getAvailableSeatsRowWise = async () => {
    const response = await fetch(BASE_URL + "getAvailableSeats", {
      method: "GET",
    });
    const data = await response.json();
    console.log(data);
    initialiseAvailableNoOfSeatsRowWise(data);
  };

  // gets and sets my booked seats set on first run from database ->
  // () empty initially -> all booked seats are present in this set
  const getBookedSeats = async () => {
    const response = await fetch(BASE_URL + "getBookedSeats", {
      method: "GET",
    });
    const data = await response.json();

    initialiseBookedSeats(data)
      .then((result) => {
        setToggle(true);
      })
      .catch((error) => {});
  };

  const resetValues = async () => {
    //empty my booked seats array in database
    let response = await fetch(BASE_URL + "emptyBookedSeats", {
      method: "DELETE",
    });
    let data = await response.json();



    // response = await fetch(BASE_URL + "resetAvailableSeats", {
    //   method: "POST",
    // });
    // data = await response.json();
    // console.log(data);




    //empty my available seats array in database
    response = await fetch(BASE_URL + "emptyAvailableSeats", {
      method: "DELETE",
    });
    data = await response.json();

    //reset my available seats array to default in database -> [7,7,7,7,7,7,7,7,7,7,7,3]
    for (let i = 0; i < 12; i++) {
      let obj = {};
      if (i !== 11) {
        obj = {
          index: i,
          value: 7,
        };
      } else {
        obj = {
          index: i,
          value: 3,
        };
      }
      const response = await fetch(
        BASE_URL + "insertAvailableSeats",
        {
          method: "POST",
          body: JSON.stringify(obj),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
    }
  };

  const handleSubmit = () => {

    // error handling for invalid input
    if (!inputSeats) {
      setError("Please enter number of seats to book");
      return;
    }
    if (inputSeats <= 0) {
      setError("Number of seats have to be positive");
      return;
    }
    if (inputSeats > 7) {
      setError("Only 7 seats can be booked at a time!");
      return;
    }
    if (inputSeats > availableSeats) {
      setError("Not enough available seats :(");
      return;
    }

    // main seat booking algorithm function
    ReserveSeats(Number(inputSeats));

    // visibility of reserved seats output
    setVisible(true);
    setError("");
    setInputSeats("");
  };

  const handleReset = async () => {

    //reset my booked seats set as empty
    totalBookedSeats.clear();
    //reset my available seats array to default -> [7,7,7,7,7,7,7,7,7,7,7,3]
    resetAvailableNoOfSeatsRowWise();

    resetValues();

    setVisible(false);
    setInputSeats("");
  };

  const handleInputChange = (event) => {
    setInputSeats(event.target.value);
  };

  
  return (
    <div className="root">
      <div className="container">
        <div>
          <FontAwesomeIcon icon={faArrowUp} size="10x" />
          <h3>facing this way</h3>
        </div>

        <button className="reset-button" onClick={handleReset}>
          <FontAwesomeIcon icon={faSync} spin className="reset-icon" />
          <span>Reset</span>
        </button>

        <div>
          <TrainCoach />
        </div>

        <div className="form">
          <p className="large-text">Enter Number of Seats</p>
          <input
            type="number"
            value={inputSeats}
            onChange={handleInputChange}
            min="0"
          />

          <button onClick={handleSubmit}>Book Now</button>

          <div className="legend">
            <div className="available-seat-identifier"></div>
            <p>Available Seats</p>
            <div className="booked-seat-identifier"></div>
            <p>Booked Seats</p>
          </div>

          {visible && (
            <div className="reserved-seats-container">
              Reserved Seats
              <div className="reserved-seats-form">
                {_currentBookedSeats.map((item, index) => (
                  <div key={index}>{item}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
