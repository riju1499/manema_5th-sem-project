import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiKey } from '../handles/apiHandler';
import axios from 'axios';
import CastsCard from '../components/MovieDetailsComp/CastsCard';
import Lenis from '@studio-freight/lenis';
import { AuthContext } from '../handles/AuthProvider';

const MovieDetailsPage = () => {

    const { movie_id } = useParams();
    const [movie, setMovie] = useState({});
    const [casts, setCasts] = useState([]);
    const [youtubeUrl, setYoutubeURL] = useState('');

    const navigate = useNavigate();

    useEffect(() => {

        // const lenis = new Lenis({
            
        //     duration: 1.2,
        //     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        //     smooth: true,
        // })

        // function raf(time) {
        //     lenis.raf(time)
        //     requestAnimationFrame(raf)
        // }

        // requestAnimationFrame(raf)

        

        const movie_by_id_url = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${apiKey}`;

        try{
            async function movieData(){
                
                const response = await axios.get(movie_by_id_url);
                setMovie(response.data);
                // console.log(response.data);

                const creditRespone = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${apiKey}`);
                const trailerResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${apiKey}`);
                const youtubeUrl = `https://www.youtube.com/watch?v=${trailerResponse.data.results[0].key}`;
                setYoutubeURL(youtubeUrl);
                setCasts(creditRespone.data.cast);
            } 
    
            movieData();
        }catch(error){
            console.log("Some error occurred: " + error);
        }

        
        // return () => {
        //     lenis.destroy()
        // }


    }, []);

    const {isAuthenticated, setIsAutheticated} = useContext(AuthContext);

  return (
    <>
    <div className='h-auto w-full bg-theme-dark text-gray-400 relative'>
        
        <div className='h-screen w-full flex justify-center items-center gap-16 relative z-[40] pb-4'>
            <div className='h-[45vh] shadow-xl shadow-orange-600 -mt-[16%] relative z-[40]'>
                <img className='h-full w-full rounded' src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="movie_background" />
            </div>
            <div className='h-[80vh] w-1/2 flex flex-col gap-6 relative z-[40]'>
                <h1 className='text-5xl'>{movie.title ? movie.title : "No Title Available"}</h1>
                <div>
                    <a target='_blank' href={youtubeUrl} className='px-6 py-1 border border-orange-500 rounded-xl hover:bg-orange-500 hover:text-black transition-hover duration-200'>Watch Trailer</a>
                </div>
                <div className='h-auto'>
                    <p>{movie.overview ? movie.overview : 'No overview availabe' }</p>
                    <h3 className='mt-6 text-gray-200'>Release Date: <span className='text-gray-400'>{movie.release_date}</span></h3>
                    <h3 className='mt-2 text-gray-200'>Duration: <span className='text-gray-400'>{movie.runtime} mins</span></h3>
                    <h3 className='mt-2 text-gray-200'>Status: <span className='text-gray-400'>{movie.status}</span></h3>
                    <h3 className='mt-2 text-gray-200'>Genre: {movie?.genres ? (
                        <>{movie.genres.map(gen => (<span className='mr-2 cursor-default text-gray-400' key={gen.id}>{gen.name}</span>))}</>
                    )  : 'No genre available'}</h3>
                    <h3 className='mt-2 text-gray-300 '>Production Companies: {movie?.production_companies ? (
                        <>
                            {movie.production_companies.map(comp => (<span className='text-gray-400 mr-2 hover:text-gray-100 cursor-default' key={comp.id}>{comp.name}</span>))}
                        </>
                    ): 'No Companies Found'}</h3>
                </div>

                <div className='flex gap-2'>
                    <button onClick={() => navigate(-1)} className='px-4 py-2 bg-gray-900 rounded hover:text-white mr-2'>Go Back</button>
                    <Link to={'/'} className='px-4 py-2 bg-gray-900 rounded hover:text-white'>Home Page</Link>
                </div>
                
                
            </div>

            <div className='absolute top-0 right-0 h-[80vh] w-full z-10 pointer-events-none flex justify-center items-center'>
                <img className='h-full w-full opacity-20' src={`http://image.tmdb.org/t/p/w1280${movie.backdrop_path}?api_key=${apiKey}`} alt="movie_bakground_image" />
                <div className='h-full w-full bg-gradient-to-r from-theme-dark via-transparent to-theme-dark absolute z-15'></div>
            </div>
        </div>
    </div>
    <div className='h-[80vh] w-full bg-theme-dark -mt-[20vh] relative z-[15] px-6 py-4'>
        <h1 className='text-3xl mb-10 text-gray-300'>Movie Casts</h1>
        <div className='h-auto w-full flex gap-6 overflow-x-auto px-6 no-scrollbar'>
            {casts.map(cast => <CastsCard key={cast.id} cast={cast} />)}
        </div>
    </div>
    </>
  )
}

export default MovieDetailsPage;