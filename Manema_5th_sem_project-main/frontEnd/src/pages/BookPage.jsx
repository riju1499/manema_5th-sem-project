import axios from 'axios';
import React, { useLayoutEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiKey, backend_api } from '../handles/apiHandler';
import SeatComponent from '../components/HomePageComp/SeatComponent';
import {toast} from 'react-toastify';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';


const BookPage = () => {

    const {movie_id} = useParams();
    const navigate = useNavigate();

    const [movieFromApi, setMovieFromApi] = useState([]);
    const [movieFromBackend, setMovieFromBackend] = useState([]);
    const [showDate, setShowDate] = useState('');
    const [hallDetail, setHallDetail] = useState([]);

    useLayoutEffect(() => {

        const getMovieFromAPI = async () => {
            try{
                const formData = new FormData()
                formData.append('movie_id', movie_id);
                const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${apiKey}`);
                const responseTwo = await backend_api.post('movieById/', formData);
                setMovieFromBackend(responseTwo.data);
                if(responseTwo.status == 200){
                    const hallResponse = await backend_api.post('hallById/', {
                        hall_id: responseTwo.data.hall,
                    })
                    console.log(hallResponse.data);
                    setHallDetail(hallResponse.data);
                }
                const formattedDate = responseTwo.data?.show_date_and_time
                    ? format(new Date(responseTwo.data.show_date_and_time), "MMMM d, yyyy 'at' h:mm a")
                    : "Date not available";
                setShowDate(formattedDate)
                setMovieFromApi(response.data);
            }catch(error){
                console.log(error)
            }
        }

        getMovieFromAPI();
    }, []);


    //for handling seats
    const [selectedSeats, setSelectedSeats] = useState([]);
    const addSeat = (seat_number) => {
        setSelectedSeats((prevSeats) => {
            if (prevSeats.includes(seat_number)) {
                return prevSeats.filter((seat) => seat !== seat_number);
            } else {
                return [...prevSeats, seat_number];
            }
        });
    }

    const bookSeats = async () => {
        if(formData.username == '' || formData.password == ''){
            toast.error('You must fill both the fields.', {className: "custom-toast-fail"});
            return;
        }

        if(formData.password.length > 4 || formData.password.length < 4){
            toast.error('Password needs to be 4 characters long.', {className: "custom-toast-fail"});
            return;
        }
        const showId = movieFromBackend.id;

        if (selectedSeats.length === 0) {
            toast.error("Please select at least one seat.");
            return;
        }

        try {
            const response = await backend_api.post("bookSeats/", {
                show_id: showId,
                seat_numbers: selectedSeats,
            });

            console.log(response.data);
            toast.success(response.data.message || "Seats booked successfully!", {className: "custom-toast"});
            generatePDF(response.data);
            checkOutModalRef.current.classList.remove('flex');
            checkOutModalRef.current.classList.add('hidden');
            setSelectedSeats([]);
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.error || "An error occurred.");
            } else {
                toast.error("Unable to connect to the server.");
            }
        }finally{
            setFormData({
                username: '',
                password: '',
            })
        }
    };

    const generatePDF = (data) => {
        const doc = new jsPDF();
    
        // Add Title
        doc.setFontSize(18);
        doc.text("Booking Confirmation", 20, 20);
    
        // Add custom message
        doc.setFontSize(12);
        const message = data.message || "Seats booked successfully!";
        doc.text(message, 20, 30);
    
        // Add booked seats
        const bookedSeatsText = `Booked Seats: ${data.booked_seats.join(', ')}`;
        doc.text(bookedSeatsText, 20, 40);
    
        // Save the PDF with a filename
        doc.save('booking-confirmation.pdf');
    };


    //for the check out form modal 
    const checkOutModalRef = useRef(null);
    const removeCheckoutModal = () => {
        checkOutModalRef.current.classList.remove('flex');
        checkOutModalRef.current.classList.add('hidden');
    }

    const popUpCheckoutModal = () => {
        checkOutModalRef.current.classList.remove('hidden');
        checkOutModalRef.current.classList.add('flex');
    }


    //for esewa credentials 
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    })

    const handleInputs = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handleClicksInsideCheckOutForm = (e) => {
        e.stopPropagation();
    }



  return (
    <div className='h-screen w-screen bg-theme-dark text-gray-300 px-8 py-4 space-y-2 relative z-[99] overflow-y-scroll flex'>
        <div className='absolute top-0 right-0 h-[80vh] w-full z-[30] pointer-events-none flex justify-center items-center'>
            <img className='h-full w-full opacity-20' src={`http://image.tmdb.org/t/p/w1280${movieFromApi.backdrop_path}?api_key=${apiKey}`} alt="movie_bakground_image" />
            <div className='h-full w-full bg-gradient-to-r from-theme-dark via-transparent to-theme-dark absolute z-15'></div>
            <div className='h-[15%] w-full bg-gradient-to-b from-transparent via-theme-dark to-theme-dark absolute bottom-[-5%] z-15'></div>
        </div>
        <div>
            <div className=' relative z-[40] space-y-3 mt-10'>
                <h1 className='text-5xl w-full mb-8 text-yellow-500'>{movieFromApi.title ? movieFromApi.title : "Movie Name Not Available"}</h1>
                <h1 className=''>Movie: <span className='text-yellow-600'>{movieFromApi.title ? movieFromApi.title : "Not Available"}</span></h1>
                <h1 className=''>Genre: <span className='text-yellow-600'>{movieFromApi?.genres ? (
                            <>{movieFromApi.genres.map(gen => (<span className='mr-2 cursor-default' key={gen.id}>{gen.name}</span>))}</>
                        )  : 'No genre available'}</span></h1>
                <h1 className=''>Duration: <span className='text-yellow-600'>{movieFromApi.title ? movieFromApi.title : "Not Available"}</span></h1>
                <h1 className=''>Available Seats: <span className='text-yellow-600'>{movieFromBackend.available_seats ? movieFromBackend.available_seats + " Seats" : "N/A"}</span></h1>
                <h1 className=''>Hall Name: <span className='text-yellow-600'>{hallDetail.name ? hallDetail.name : "Not Available"}</span></h1>
                <h1 className=''>Hall Location: <span className='text-yellow-600'>{hallDetail.location ? hallDetail.location : "Not Available"}</span></h1>
                <h1 className=''>Date And Time: <span className='text-yellow-600'>{showDate ? showDate : "Not Available"}</span></h1>
            </div>
            <div className='h-auto w-full relative z-[40] mt-4'>
                <button onClick={() => navigate(-1)} className='px-4 py-2 bg-gray-900 rounded hover:text-white mr-4 mt-2'>Go Back</button>
                <Link to={'/'} className='px-4 py-2 bg-gray-900 rounded hover:text-white mt-2'>Home Page</Link>
            </div>
        </div>


        <div className='h-auto w-full relative z-[40] flex flex-col items-center'>
            {/* <h1 className='text-4xl self-start mb-16 mt-8'>Select the seats</h1> */}
            <div className='h-auto w-[80%] flex justify-center items-center flex-wrap gap-6 mt-12 pb-24'>
                {movieFromBackend.seats ? movieFromBackend.seats.map(seat => (
                    <SeatComponent seat={seat} key={seat.id} addSeat={addSeat} />
                )) : "No seats to show."}
            </div>
        </div>

        <div className='px-4 py-2 w-[10vw] bg-[rgba(0,0,0,0.6)] rounded-xl text-gray-400 fixed bottom-12 left-8 flex justify-center items-center flex-col z-[99]'>
            <h1 className='mb-2 text-gray-300 font-bold'>Selected Seats:</h1>
            {selectedSeats.length == 0 ? (
                <span>None</span>
            ): (
                <>
                    <div className='h-auto w-full flex flex-wrap items-center gap-2 mb-2'>
                        {selectedSeats.map(seat => (
                            <span key={seat}>{seat}</span>
                        ))}
                    </div>
                    <span onClick={popUpCheckoutModal} className='px-2 py-1 bg-black border border-white rounded-lg cursor-pointer hover:bg-green-600 hover:text-black self-start text-gray-300'>Check Out</span>
                </>
            )}
        </div>

        <div ref={checkOutModalRef} onClick={removeCheckoutModal} className={`h-screen w-screen hidden justify-center items-center bg-[rgba(0,0,0,0.5)] fixed top-0 left-0 z-[999]`}>
            <div onClick={handleClicksInsideCheckOutForm} className='h-[42vh] w-[22vw] bg-green-600 rounded-xl flex flex-col items-center px-4 py-4 border-2 border-white'>
                <div className='h-auto w-full flex justify-between items-center'>
                    <img src="/esewa-icon.png" alt="esewa-logo" className='h-[8vh] bg-white rounded-full' />
                    <h1 className='text-2xl text-white font-bold font-playwrite'>Pay with Esewa</h1>
                </div>
                <div className='h-auto w-full flex flex-col justify-center gap-4 mt-6'>
                    <input onChange={handleInputs} value={formData.username} name='username' type="number" placeholder='Enter Your Esewa Id'  className='px-3 py-3 rounded-lg bg-[rgba(0,0,0,0.4)] border-b-2 border-white no-button-in-input focus:outline-none'/>
                    <input onChange={handleInputs} value={formData.password} name='password' type="number" placeholder='Enter Your PIN' className='px-3 py-3 rounded-lg bg-[rgba(0,0,0,0.4)] border-b-2 border-white no-button-in-input focus:outline-none' />
                    <button onClick={bookSeats} className='h-[6vh] w-full bg-black text-white rounded-xl hover:bg-gray-900 mt-4'>Procceed</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default BookPage;
