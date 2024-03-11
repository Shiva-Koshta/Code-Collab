import React from "react";
import BackgroundImage2 from '../images/BackgroundImage2.jpeg';
import '../index'

const About = () => {
  return (
    <div className="about-us-container h-screen"
    style={{backgroundImage: `url(${BackgroundImage2})`}}>
    {/* > */}
      <p className="text-3xl">About US!</p>
    </div>
  )
}

export default About;