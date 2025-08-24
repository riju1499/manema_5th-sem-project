import React, { useEffect, useState } from 'react'
import { apiKey, backend_api } from '../../handles/apiHandler';
import { faCircleInfo, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';
import axios from 'axios';

const BookableMovieCards = ({movie_id}) => {

    const [movie, setMovie] = useState([]);

    useEffect(() => {

        const getMovie = async () => {
            try{
                const response = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${apiKey}&language=en-US`);
                setMovie(response.data)
            }catch (error){
                if(error.response){
                    toast("Couldn't fetch the movie.", {className: "custom-toast", progressClassName: "custom-progress-bar-fail"});
                }else if(error.request){
                    toast("Couldn't connect to the server.", {className: "custom-toast", progressClassName: "custom-progress-bar-fail"})
                }else{
                    toast("Some error occurred.", {className: "custom-toast", progressClassName: "custom-progress-bar-fail"})
                }
            }
        }
        getMovie();
    }, []);

    const handleDeleteMovie = async (movie_id) => {
        console.log(movie_id)
        try{
            const response = await backend_api.delete('showMovies/', {data: {movie_id: movie_id}, });
            if(response.status === 204){
                toast.success('Successfully removed the movie', {className: 'custom-toast'});
            }
        }catch (error){
            if(error.response){
                toast("Couldn't delete the movie.", {className: "custom-toast", progressClassName: "custom-progress-bar-fail"});
            }else if(error.request){
                toast("Couldn't connect to the server.", {className: "custom-toast", progressClassName: "custom-progress-bar-fail"})
            }else{
                toast("Some error occurred.", {className: "custom-toast", progressClassName: "custom-progress-bar-fail"})
                console.log(error);
            }
        }
    }


  return (
    <div  className='h-[12vh] w-[90%] flex items-center justify-between border border-gray-700 rounded relative z-[99] px-4 py-2 overflow-hidden'>
            <div className='absolute top-0 left-0 z-10'>
                <img className='rounded-r-[30%]' src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`} alt={`${movie.title}-backdrop`} />
            </div>
            <div className='absolute z-20 h-full top-0 left-0 w-full bg-gradient-to-r from-[rgba(0,0,0,0.4)] via-[rgba(0,0,0,0.8)] to-[rgba(0,0,0,1)] via-[10%]'></div>
            
            <div className='relative z-[99]'>
                <h1 className='text-xl text-gray-300 font-playwrite'>{movie.title}</h1>
            </div>
            <div className={`relative z-[99] flex gap-6`}>
                <Link to={`/movie/${movie.id}`} className='bg-gray-900 text-gray-500 rounded px-4 py-2 hover:text-gray-300 flex items-center justify-center gap-2'>
                    <FontAwesomeIcon icon={faCircleInfo} />
                    <span className=''>Show Details</span>
                </Link >
                <button onClick={() => handleDeleteMovie(movie_id)} className='bg-gray-900 text-gray-500 rounded px-4 py-2 hover:text-red-500 flex items-center justify-center gap-2'>
                    <FontAwesomeIcon icon={faTrash} />
                    <span className=''>Remove This Movie</span>
                </button>
            </div>
    
        </div>
  )
}

export default BookableMovieCards;
