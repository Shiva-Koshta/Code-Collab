import React, { useState } from 'react';
import '../styles/helpPage.css';
import LoginDemo from "../images/LoginDemo.png"
import SignUp from "../images/SignUp.png";
import Password from "../images/Password.png";
import Room from "../images/Room.png";
import RoomCreation from "../images/RoomCreation.png";
import ChatBox from "../images/ChatBox.png";
import toast, { Toaster } from 'react-hot-toast';

const HelpPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:8080/help', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success('Form submitted successfully');
            } else {
                toast.error('Form submission failed');
            }

            setFormData({
                name: '',
                email: '',
                message: ''
            });

        } catch (error) {
            console.error('Error:', error);
            // Show error toast message if an error occurs during form submission
            toast.error('An error occurred while submitting the form');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="bigger-container">
                <div className="inner-container">
                    <h1 className="heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-center">Help</h1>
                    <div className="step">
                        <div className="stepcontent flex flex-col lg:flex-row items-center">
                            <div className="stepinfo lg:w-1/2 text-center lg:text-left">
                                <h2>Step 1: Login</h2>
                                <p>On the login screen, you will see an option to sign in with your Google account.</p>
                                <p>Click on the "Sign in with Google" button.</p>
                            </div>
                            <div className="stepimage lg:w-1/2">
                                <img src={LoginDemo} alt="Login Demo" />
                            </div>
                        </div>
                    </div>

                    <div className="step">
                        <div className="stepcontent flex flex-col lg:flex-row items-center">
                            <div className="stepimage lg:w-1/2">
                                <img src={SignUp} alt="Authenticate Demo" />
                            </div>
                            <div className="stepinfo lg:w-1/2 text-center lg:text-left">
                                <h2>Step 2: Authenticate with Google</h2>
                                <p>You will be redirected to Google's authentication page.</p>
                                <p>Enter your Google credentials or use an already saved account.</p>
                            </div>
                        </div>
                    </div>

                    <div className="step">
                        <div className="stepcontent flex flex-col lg:flex-row items-center">
                            <div className="stepinfo lg:w-1/2 text-center lg:text-left">
                                <h2>Step 3: Password verification</h2>
                                <p>Enter your password and click on ‘Next’ to continue with the sign-in process.</p>
                                <p>If you don’t remember your password, click on the forgot password option.</p>
                            </div>
                            <div className="stepimage lg:w-1/2">
                                <img src={Password} alt="Password Demo" />
                            </div>
                        </div>
                    </div>

                    <div className="step">
                        <div className="stepcontent flex flex-col lg:flex-row items-center">
                            <div className="stepimage lg:w-1/2">
                                <img src={RoomCreation} alt="Room Demo" />
                            </div>
                            <div className="stepinfo lg:w-1/2 text-center lg:text-left">
                                <h2>Step 4: Room creation and Joining</h2>
                                <p>If you have a room ID available, enter it in the "Room ID” option and click on ‘Join’.</p>
                                <p>If you want to create a new room, click on the “Create New Room option”.</p>
                                <p>This will prompt a new room ID which will be visible to you in the "Room ID” option. Now, click on “Join”.</p>
                            </div>
                        </div>
                    </div>

                    <div className="step">
                        <div className="stepcontent flex flex-col lg:flex-row items-center">
                            <div className="stepinfo lg:w-1/2 text-center lg:text-left">
                                <h2>Step 5: Code editor</h2>
                                <p><b>UPLOAD FILE:</b> This option allows you to upload any file from your local device to your editor screen. All users currently present in the same room as you would be able to view it and all changes made to it.</p>
                                <p><b>CONNECTED USERS HERE:</b>  Here, you can see the usernames of all connected users in the room.</p>
                                <p><b>COPY ROOM ID:</b>  This allows you to copy your current room ID so that you can share it with the collaborators to your project.</p>
                                <p><b>LEAVE:</b>  This button prompts the user to leave the current room the user is in.</p>
                                <p><b>EDITOR:</b>  The code editor has real-time synchronization to handle multiple cursors at the same time. All users present in a room currently can modify the editor’s code.</p>
                                <p><b>CHAT:</b>  This button opens up a chat box where you can communicate with other users in the same room as you.</p>
                            </div>
                            <div className="stepimage lg:w-1/2">
                                <div className="stepimage"><img src={Room} alt="Editor Demo" /></div>

                                <div className="stepimage"><img src={ChatBox} alt="Editor Demo" /></div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form lg:flex lg:justify-between lg:items-center">
                        <div className="w-full lg:w-1/2">
                            <p className="text-5xl text-center lg:text-left satisfy-regular font-bold p-8">Contact Us</p>
                            <p className="text-xl text-center lg:text-left satisfy-regular p-8">Great things are not done by impulse, but by a series of small things brought together.</p>
                        </div>
                        <div className="w-full lg:w-1/2">
                            <form onSubmit={handleSubmit} className="flex flex-col" method='POST'>
                                <div className="mb-5">
                                    <label className="text-lg mb-2" htmlFor="name">Name</label>
                                    <input className='w-full text-gray-700 p-2.5 text-lg border-2 border-solid rounded-md outline-none border-stone-300' type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                                </div>
                                <div className="formgroup">
                                    <label className="text-lg mb-2" htmlFor="email">Email</label>
                                    <input className='w-full text-gray-700 p-2.5 text-lg border-2 border-solid rounded-md outline-none border-stone-300' type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="formgroup">
                                    <label className="text-lg mb-2" htmlFor="message">Message</label>
                                    <textarea className='w-full text-gray-700 p-2.5 text-lg border-2 border-solid rounded-md outline-none border-stone-300' id="message" name="message" value={formData.message} onChange={handleChange} required></textarea>
                                </div>
                                <div className="flex justify-center"> {/* Center the button */}
                                    <button type="submit" className="relative max-w-xs h-12 bg-blue-600 text-white text-lg border-none rounded-md cursor-pointer outline-none mb-6 hover:bg-blue-700 flex items-center justify-center w-full"> {/* Ensure full width */}
                                        {isSubmitting ? (
                                            <span className="flex items-center">
                                                <span className="loading-spinner mr-2"></span>
                                                Submitting...
                                            </span>
                                        ) : (
                                            'Submit'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
            <Toaster />
        </>
    );
}

export default HelpPage;

