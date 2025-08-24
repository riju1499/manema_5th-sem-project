import axios from 'axios';
import React, { Children, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { apiKey } from '../../handles/apiHandler';
import gsap from 'gsap';
import { Link } from 'react-router-dom';

const NowPlayingMoviesCard = ({movieOne}) => {

    const [movie, setMovie] = useState([]);

    useLayoutEffect(() => {

        const getMovies = async () => {
            try{
                const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieOne.movie_id}?api_key=${apiKey}`);
                setMovie(response.data);
                console.log(response.data);
            }catch(error){
                console.log(error);
            }
        }

        getMovies();

    }, []);

  return (
    <div className='h-[54vh] w-[20%] rounded relative px-4 py-4 flex flex-col justify-around gap-12 border border-yellow-900'>
    
        <div className="h-[30%] w-full relative z-[40]"></div>

        <div className='relative z-[90] text-gray-300 flex flex-col gap-4'>
        <h1 className='text-xl text-yellow-500 font-playwrite line-clamp-2 font-bold'>{movie.title}</h1>
        <p className='line-clamp-4 text-sm w-[80%]'>{movie.overview ? movie.overview : "Movie Details Unavailable"}</p>
        </div>

        <div className='relative z-[90] flex justify-between w-full text-sm'>
            <Link to={`/book/${movie.id}`} className='py-2 px-4 bg-orange-700  text-black rounded hover:px-5 active:px-4 hover:bg-orange-500 transition-hover duration-150'>Book</Link>
            <Link to={`/movie/${movie.id}`} className={`hover:border hover:border-orange-600 px-5 py-2 transition-hover duration-100 hover:text-gray-200 rounded active:border-orange-500`}>See Details</Link>
        </div>


        <div className={`h-full w-full absolute top-0 left-0 rounded z-[40] opacity-80 ${movie?.backdrop_path ? 'bg-cover' : 'bg-none'}`} style={movie?.backdrop_path ? { backgroundImage: `url('https://image.tmdb.org/t/p/original${movie.backdrop_path}')` } : {}}> </div>

        <div className='h-full w-full absolute top-0 left-0 z-[50] bg-gradient-to-t from-[rgba(0,0,6,1)] via-[rgba(12,12,21,0.6)] to-[rgba(0,0,6,0.4)]from-[10%]'></div>
    </div>
  )
}

export default NowPlayingMoviesCard
