import Header from '../components/HomePageComp/Header'
import Banner from '../components/HomePageComp/Banner'
import MovieSection from '../components/HomePageComp/MovieSection'
import Footer from '../components/HomePageComp/Footer'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

import Lenis from '@studio-freight/lenis';

export const MovieContext = createContext({
  contextMovies: [],
  setContextMovies: () => {},
});

export const FormShowContext = createContext('');


const HomePage = () => {
  const [showForm, setShowForm] = useState(false);

  // for smooth scrolling but it presented lag, so commented.

  // useEffect(() => {
  //   const lenis = new Lenis({

  //     duration: 0.2,
  //     easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  //     smooth: true,
  //   })

  //   function raf(time) {
  //     lenis.raf(time)
  //     requestAnimationFrame(raf)
  //   }

  //   requestAnimationFrame(raf)

  //   return () => {
  //     lenis.destroy()
  //   }
  // }, []);

  const [contextMovies, setContextMovies] = useState([]);

  return (
    <MovieContext.Provider value={{contextMovies, setContextMovies}}>
      <div className='h-auto w-[100%] bg-theme-dark text-gray-400 overflow-x-hidden'>
        <FormShowContext.Provider value={{showForm, setShowForm}}>
          <Header />
          <Banner />
        </FormShowContext.Provider>
        <MovieSection />
        <Footer />
      </div>
    </MovieContext.Provider>
  )
}

export default HomePage;
