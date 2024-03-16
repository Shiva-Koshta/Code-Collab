import React, {useState} from 'react';
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
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Your message has been recorded");
        console.log(formData);
        setFormData({
            name: '',
            email: '',
            message: ''
        });
    };
    return (
        <div className="container">
            <h1 className="heading">Help</h1>
            
            <div className="step">
                <div className="step-content">
                    <div className="step-info">
                        <h2>Step 1: Login</h2>
                        <p>On the login screen, you will see an option to sign in with your Google account.</p>
                        <p>Click on the "Sign in with Google" button.</p>
                    </div>
                    <div className="step-image">
                        <img src= {LoginDemo} alt="Login Demo" />
                    </div>
                </div>
            </div>

            <div className="step">
                <div className="step-content">
                    <div className="step-image">
                        <img src={SignUp} alt="Authenticate Demo" />
                    </div>
                    <div className="step-info">
                        <h2>Step 2: Authenticate with Google</h2>
                        <p>You will be redirected to Google's authentication page.</p>
                        <p>Enter your Google credentials or use an already saved account.</p>
                    </div>
                </div>
            </div>

            <div className="step">
                <div className="step-content">
                    <div className="step-info">
                        <h2>Step 3: Password verification</h2>
                        <p>Enter your password and click on ‘Next’ to continue with the sign-in process.</p>
                        <p>If you don’t remember your password, click on the forgot password option.</p>
                    </div>
                    <div className="step-image">
                        <img src={Password} alt="Password Demo" />
                    </div>
                </div>
            </div>

            <div className="step">
                <div className="step-content">
                    <div className="step-image">
                        <img src={RoomCreation} alt="Room Demo" />
                    </div>
                    <div className="step-info">
                        <h2>Step 4: Room creation and Joining</h2>
                        <p>If you have a room ID available, enter it in the "Room ID” option and click on ‘Join’.</p>
                        <p>If you want to create a new room, click on the “Create New Room option”.</p>
                        <p>This will prompt a new room ID which will be visible to you in the "Room ID” option. Now, click on “Join”.</p>
                    </div>
                </div>
            </div>

            <div className="step">
                <div className="step-content">
                    <div className="step-info">
                        <h2>Step 5: Code editor</h2>
                        <p>UPLOAD FILE: This option allows you to upload any file from your local device to your editor screen. All users currently present in the same room as you would be able to view it and all changes made to it.</p>
                        <p>CONNECTED USERS HERE: Here, you can see the usernames of all connected users in the room.</p>
                        <p>COPY ROOM ID: This allows you to copy your current room ID so that you can share it with the collaborators to your project.</p>
                        <p>LEAVE: This button prompts the user to leave the current room the user is in.</p>
                        <p>EDITOR: The code editor has real-time synchronization to handle multiple cursors at the same time. All users present in a room currently can modify the editor’s code.</p>
                        <p>CHAT: This button opens up a chat box where you can communicate with other users in the same room as you.</p>
                    </div>
                    <div className="step-image">
                        <div className="step-image"><img src={Room} alt="Editor Demo" /></div>
                        
                        <div className="step-image"><img src={ChatBox} alt="Editor Demo" /></div>
                    </div>
                </div>
            </div>

            <h1 className="heading">Contact Us</h1>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required></textarea>
                </div>
                <button type="submit" className="btn-submit">Submit</button>
            </form>
            <Toaster />
        </div>
    );
}

export default HelpPage;
