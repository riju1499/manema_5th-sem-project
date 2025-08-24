import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { backend_api } from '../../handles/apiHandler';
import BookableMovieCards from './BookableMovieCards';

const RemoveMoviesPage = () => {

  const [bookableMovies, setBookableMovies] = useState([]);

  useEffect(() => {

    const handleGettingMovies = async () => {
      try{
        const response =  await backend_api.get('showMovies/');
        setBookableMovies(response.data);


      }catch (error){
        if(error.response){
          toast("Couldn't fetch the movies.", {className: "custom-toast", progressClassName: "custom-progress-bar-fail"});
        }else if(error.request){
          toast("Couldn't connect to the server.", {className: "custom-toast", progressClassName: "custom-progress-bar-fail"})
        }else{
          toast("Some error occurred.", {className: "custom-toast", progressClassName: "custom-progress-bar-fail"})
        }
      }
    }

    handleGettingMovies();
  }, []);

  return (
    <div className='h-[82vh] w-full bg-theme-dark text-gray-400 px-6 flex flex-col items-center'>

        <div className='h-auto w-[80%] flex flex-col items-center flex-wrap gap-6 mt-12'>

          {bookableMovies.map(movie => (
            <BookableMovieCards key={movie.id} movie_id={movie.movie_id} />
          ))}

          {bookableMovies.length == 0 && (
            <div className=''>
              <h1>No movies are available for booking.</h1>
            </div>
          )}

        </div>

    </div>
  )
}

export default RemoveMoviesPage;
