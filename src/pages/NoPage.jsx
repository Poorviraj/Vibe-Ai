import React from 'react'
import { Link } from 'react-router-dom'
import notFound from '../assets/images/notfound.png' 

const NoPage = () => {
  return <div className=' w-screen h-screen flex flex-col bg-white ' >


    <div className=' w-[70%] mx-auto flex pt-[20px] justify-between ' >

        <div className=' w-[50%] object-conatin object-center ' >
            <img src={notFound} className=' w-full ' alt="" />
        </div>
        

        <div className=' w-[50%] flex flex-col  ' >
            <p className=' mt-[40px] text-[18px] ' >Page Not Found</p>
            <p className=' text-[152px] text-[#0000004d] font-[gt-super] leading-[152px] ' >404</p>
            <p className=' text-[66px] font-[gt-super] leading-[66px] text-black ' >Out of <br />nothing, <br />something.</p>
            <p className=' mt-[15px] max-w-[500px] text-[20px] leading-[24px] text-gray-500 ' >You can build (almost) anything with Vibe AI — even components you didn’t know you needed. Maybe these ideas will help you create something fresh today?</p>
            <p className=' mt-[15px] ' >
              <Link to="/" className=' text-[20px] underline text-black ' >Home</Link>
            </p>
        </div>

    </div>

  </div>
}

export default NoPage