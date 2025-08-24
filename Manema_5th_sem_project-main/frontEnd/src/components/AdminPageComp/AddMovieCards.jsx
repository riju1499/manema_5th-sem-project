import { faCircleInfo, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import { backend_api } from '../../handles/apiHandler.js';


const AddMovieCards = ({movie}) => {

    //var to store the movie data to send to the backend
    const [playDate, setPlayDate] = useState('');
    const [playTime, setPlayTime] = useState('');

    const [movieData, setMovieData] = useState({
        movie_id: '',
        show_date_and_time: '',
        hall: '',
    });

    //var to set the minimum date selectable from
    const [minDate, setMinDate] = useState('');
    useEffect(() => {

      //to set the date only selectable from tomorrow onwards, kina vane you can't set a movie in the past.
      const today = new Date();
  
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      const yyyy = tomorrow.getFullYear();
      const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
      const dd = String(tomorrow.getDate()).padStart(2, '0');
      const minDateFormatted = `${yyyy}-${mm}-${dd}`;
  
      setMinDate(minDateFormatted);

      //setting up the movie id
      setMovieData((prevState) => ({...prevState,movie_id: movie.id }));

    }, []);
  
    //to either view the input slots or not
    const [addTheMovie, setAddTheMovie] = useState(false);

    const handleInputs = (e) => {
        setMovieData({...movieData, [e.target.name]: e.target.value});
    }

    const handlePlayDate = (e) => {
        setPlayDate(e.target.value);
    }

    const handlePlayTime = (e) => {
        setPlayTime(e.target.value);
    }


    //to submit the form to the backend of manema !!!
    const addMovie = async (e) => {
        e.preventDefault();

        if(movieData.hall == '' || movieData.play_date == '' || movieData.play_time == ''){
            toast("Ensure all fields are filled in.", {
                className: 'custom-toast',
                progressClassName: 'custom-progress-bar-fail',
            });
            return;
        }

        let hallIsValid = false;
        const validHalls = [1,2,4,5];
        for(let i=0; i<validHalls.length; i++){
            if(movieData.hall == validHalls[i]){
                hallIsValid = true;
                break;
            }
        }

        if(!hallIsValid){
            toast("Please Enter a valid Hall Id.", {
                className: 'custom-toast',
                progressClassName: 'custom-progress-bar-fail',
            });
            return;
        }

        const updatedMovieData = {...movieData, show_date_and_time: playDate + " " + playTime};

        try {
            const response = await backend_api.post('showMovies/', updatedMovieData);
            console.log(response.data);
            toast("Added the movie to be available for booking.", {
                className: 'custom-toast',
                progressClassName: 'custom-progress-bar',
            });
        }catch(error){
            if(error.response){
                console.log("Error Response Data:", error.response.data); 
                console.log("Error Response Status:", error.response.status);
                console.log("Error Response Headers:", error.response.headers);
            }else{
                console.log(error);
            }
            toast("Couldn't add the movie.", {
                className: 'custom-toast',
                progressClassName: 'custom-progress-bar-fail',
            });
        }finally{
            setMovieData({
                movie_id: '',
                show_date_and_time: '',
                hall: '',
            });
        }

        console.log(movieData.movie_id);
        console.log(movieData.hall);
        console.log(movieData.show_date_and_time);
    }

    //and yes, I like to say Manea, it has quite a ring to it.

  return (
    <div  className='h-[12vh] w-[90%] flex items-center justify-between border border-gray-700 rounded relative z-[99] px-4 py-2 overflow-hidden'>
        <div className='absolute top-0 left-0 z-10'>
            <img className='rounded-r-[30%]' src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={`${movie.title}-backdrop`} />
        </div>
        <div className='absolute z-20 h-full top-0 left-0 w-full bg-gradient-to-r from-[rgba(0,0,0,0.4)] via-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,1)] via-[10%]'></div>
        
        <div className='relative z-[99]'>
            <h1 className='text-xl text-gray-300 font-playwrite'>{movie.title}</h1>
        </div>
        <div className={`relative z-[99] ${addTheMovie ? 'hidden' : ""} flex gap-6`}>
            <Link to={`/movie/${movie.id}`} className='bg-gray-900 text-gray-500 rounded px-4 py-2 hover:text-gray-300 flex items-center justify-center gap-2'>
                <FontAwesomeIcon icon={faCircleInfo} />
                <span className=''>Show Details</span>
            </Link >
            <button onClick={() => setAddTheMovie(true)}  className='bg-gray-900 text-gray-500 rounded px-4 py-2 hover:text-gray-300 flex items-center justify-center gap-2'>
                <FontAwesomeIcon icon={faPlus} />
                <span className=''>Add This Movie</span>
            </button>
        </div>
        <div className={`${addTheMovie ? '' : 'hidden'} relative z-[99]`}>
            <form onSubmit={addMovie} className='relative z-[99] flex gap-6'>
                <input type="date" placeholder='Play-Date' className='text-gray-400 bg-gray-900 border border-gray-800 rounded pl-2 py-2 placeholder:text-gray-600' value={playDate} onChange={handlePlayDate} name='play_date' min={minDate}/>
                <input type="time" placeholder='Play-Time' name='play_time' className='text-gray-400 bg-gray-900 border border-gray-800 rounded pl-2 py-2 placeholder:text-gray-600' value={playTime} onChange={handlePlayTime}/>
                <input type="number" placeholder='Hall-Id' name='hall' className='text-gray-300 bg-gray-900 border border-gray-800 rounded pl-2 py-2 w-[5vw] placeholder:text-gray-600 no-button-in-input' value={movieData.hall} onChange={handleInputs}/>

                <button type='submit' onClick={addMovie} className='flex justify-center items-center gap-2 bg-gray-900 text-gray-500 rounded px-4 py-2 hover:text-gray-300'>
                    <FontAwesomeIcon icon={faPlus} />
                    <span className=''>Add</span>
                </button>
                <button onClick={() => setAddTheMovie(false)} type='button' className='flex justify-center items-center gap-2 bg-gray-900 text-gray-500 rounded px-4 py-2 hover:text-gray-300'>
                <FontAwesomeIcon icon={faXmark} />
                <span className=''>Cancel</span>
                </button>
            </form>
            
        </div>

    </div>
  )
}

export default AddMovieCards
