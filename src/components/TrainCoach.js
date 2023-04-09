import React from "react";
import { totalBookedSeats, totalSeats } from "../helper/SeatBooker";
import { FaChair } from 'react-icons/fa';


function TrainCoach () {
  return (
    <div className="train-coach">
      {totalSeats.map((item, index) => {
        
        return (
          <div className="row" key={"row" + index}>
            {item.map((value, column_index) => (
              <div>
                <div
                  key={"col" + column_index}
                  className={`seat ${totalBookedSeats.has(value) ? "booked" : ""}`}
                >
                  <FaChair size={20} style={{ marginTop: '3px' }} />
                  {value}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default TrainCoach;
