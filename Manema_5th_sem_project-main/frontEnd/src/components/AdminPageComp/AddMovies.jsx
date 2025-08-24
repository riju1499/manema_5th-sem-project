import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { apiKey } from '../../handles/apiHandler';
import MovieCards from '../HomePageComp/MovieCards';
import AddMovieCards from './AddMovieCards';

const AddMovies = () => {
  
    const [movies, setMovies] = useState([]);

    useEffect(() => {

        const getMovies = async () => {
            try{
                const response = await axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=en-US&page=1`);
                setMovies(response.data.results);
            }catch(error){
                console.error(error);
            }
        }

        getMovies();
    }, []); 
  
  
  
    return (
    <div className='h-[auto] w-full bg-theme-dark overflow-x-hidden flex justify-center'>
      <div className='h-auto w-[80%] flex flex-col items-center flex-wrap gap-6 mt-12'>

        {movies.map(movie => (
                <AddMovieCards movie={movie} key={movie.id} />
        ))}




      </div>
    </div>
  )
}

export default AddMovies
