import { BASE_URL} from "./api";


export const totalSeats = [
  ["A1", "A2", "A3", "A4", "A5", "A6", "A7"],
  ["B1", "B2", "B3", "B4", "B5", "B6", "B7"],
  ["C1", "C2", "C3", "C4", "C5", "C6", "C7"],
  ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
  ["E1", "E2", "E3", "E4", "E5", "E6", "E7"],
  ["F1", "F2", "F3", "F4", "F5", "F6", "F7"],
  ["G1", "G2", "G3", "G4", "G5", "G6", "G7"],
  ["H1", "H2", "H3", "H4", "H5", "H6", "H7"],
  ["I1", "I2", "I3", "I4", "I5", "I6", "I7"],
  ["J1", "J2", "J3", "J4", "J5", "J6", "J7"],
  ["K1", "K2", "K3", "K4", "K5", "K6", "K7"],
  ["L1", "L2", "L3"],
];

//depicts my available seats array
export let availableNoOfSeatsRowWise = [];

//depicts my booked seats set
export const totalBookedSeats = new Set();

//depicts my currently booked seats by the user which are shown in the output
export let currentBookedSeats = new Set();

export function initialiseAvailableNoOfSeatsRowWise(data) {
  data.forEach((item) => {
    availableNoOfSeatsRowWise[item.index] = item.value;
  });
}

export function initialiseBookedSeats(data) {
  return new Promise((resolve, reject) => {
    data.forEach((item) => {
      totalBookedSeats.add(item.value);
    });
    resolve(true);
  });
}

export function resetAvailableNoOfSeatsRowWise() {
  availableNoOfSeatsRowWise = [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 3];
}

const insertTotalBookedSeats = async () => {

  //empty booked seats set in my database
  let response = await fetch(BASE_URL + "emptyBookedSeats", {
    method: "DELETE",
  });
  let data = await response.json();

  //insert booked seats set in my db
  totalBookedSeats.forEach(async (item) => {
    let obj = {
      value: item,
    };
    const response = await fetch(BASE_URL + "insertBookedSeats", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
  });
};

const updateAvailableSeatsRowWise = async () => {

  //empty my available seats array in db
  let response = await fetch(BASE_URL + "emptyAvailableSeats", {
    method: "DELETE",
  });
  let data = await response.json();

  //populate my available seats array in db
  for (let i = 0; i < availableNoOfSeatsRowWise.length; i++) {
    let obj = {
      index: i,
      value: availableNoOfSeatsRowWise[i],
    };
    const response = await fetch(BASE_URL + "insertAvailableSeats", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
  }
};

function ReserveSeats(numSeats) {
  currentBookedSeats = new Set();

  //enough to accomodate in one row
  for (let i = 0; i < availableNoOfSeatsRowWise.length; i++) {
    let noOfAvailableSeatsRowWise = availableNoOfSeatsRowWise[i];
    if (noOfAvailableSeatsRowWise >= numSeats) {
      let row = totalSeats[i];
      let rowSize = row.length;
      let startIndex = rowSize - noOfAvailableSeatsRowWise;

      for (let j = startIndex; j < startIndex + numSeats; j++) {
        currentBookedSeats.add(row[j]);
        totalBookedSeats.add(row[j]);
      }
      availableNoOfSeatsRowWise[i] = availableNoOfSeatsRowWise[i] - numSeats;

      //update my booked seats set and available seats array in db before returning
      insertTotalBookedSeats();
      updateAvailableSeatsRowWise();
      return;
    }
  }

  //not enough
  for (let i = 0; i < availableNoOfSeatsRowWise.length; i++) {
    let noOfAvailableSeatsRowWise = availableNoOfSeatsRowWise[i];
    if (noOfAvailableSeatsRowWise > 0) {
      let row = totalSeats[i];
      let rowSize = row.length;
      let startIndex = rowSize - noOfAvailableSeatsRowWise;

      for (let j = startIndex; j < rowSize; j++) {
        if (numSeats === 0) {
          //update my booked seats set and available seats array in db before returning
          insertTotalBookedSeats();
          updateAvailableSeatsRowWise();
          return;
        }
        numSeats--;
        availableNoOfSeatsRowWise[i]--;
        currentBookedSeats.add(row[j]);
        totalBookedSeats.add(row[j]);
      }
    }
  }
}

export default ReserveSeats;
