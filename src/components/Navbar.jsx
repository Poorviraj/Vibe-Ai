import React from 'react'
import SplitText from "./SplitText";

const Navbar = () => {

  return (
    <>
      <div className="nav flex items-center justify-center px-[100px] h-[90px] border-b-[1px] border-gray-800  ">
        <div className="icons flex items-center gap-[15px]" >
          <SplitText
            text="Vibe AI, An AI Component Generator"
            className="text-2xl text-center text-purple-400 text-[30px] font-semibold "
            delay={100}
            duration={0.6}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="-100px"
            textAlign="center"
          />
        </div>
      </div>
    </>
  )
}

export default Navbar