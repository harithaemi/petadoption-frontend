import React from 'react'
import dogbg from "../assets/dogbg.jpeg"
import { Link } from 'react-router-dom'

const Home = () => {
  return (
 <div className="relative h-screen w-full overflow-hidden">

  <img
    src={dogbg}
    alt="Happy dog waiting for a loving home"
    className="absolute inset-0 h-full w-full object-cover"
  />


  <div className="absolute inset-0 bg-black/40"></div>


  <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-6">
    
    <h1 className="font-righteous text-5xl md:text-7xl mb-6">
      Let's Love a Pet
    </h1>

    <p className="font-saira max-w-2xl text-lg md:text-2xl mb-10">
      Every pet deserves a loving home. Find your perfect companion,
      give them a forever family, and make a difference in their life.
    </p>

    <Link to="/signup"><button className="rounded-lg bg-red-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-red-500">
      Get Started
    </button></Link>

  </div>
</div>
  )
}

export default Home
