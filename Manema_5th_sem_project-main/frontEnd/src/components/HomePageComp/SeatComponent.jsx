import { faCouch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'

const SeatComponent = ({seat, addSeat}) => {

    const [seatSelected, setSeatSelected] = useState(false);


    const handleSelectSeat = () => {
        setSeatSelected(!seatSelected);
        addSeat(seat.seat_number);
    }


  return (
    <div onClick={handleSelectSeat}  key={seat.id} className={`${seatSelected ? 'text-green-600' : ""} active:text-green-500 h-[8vh] w-[8vw] text-5xl flex justify-center items-center flex-col ${seat.is_booked ? 'text-red-600 hover:cursor-default pointer-events-none select-none hover:text-red-600' : "text-gray-400"} hover:text-green-300 hover:cursor-pointer`}>
        <FontAwesomeIcon icon={faCouch} />
        <span className='text-sm'>{seat.seat_number}</span>
    </div>
  )
}

export default SeatComponent
