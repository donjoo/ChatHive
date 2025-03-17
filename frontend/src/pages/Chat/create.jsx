import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { FaPlusCircle, FaComments } from "react-icons/fa";

const CreateRoom = () => {
    const [roomName, setRoomName] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!roomName.trim()) {
            setMessage("Room name cannot be empty");
            return;
        }
        try {
            await api.post("create-room/", { name: roomName });
            setRoomName("");
            setMessage("Room created successfully!");
        } catch (error) {
            setMessage("Error creating room. Try again.");
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* Navbar */}
            <nav className="max-w-5xl mx-auto flex justify-between items-center py-4 px-6">
                <div className="flex items-center space-x-3">
                    <FaComments size={28} className="text-blue-500" />
                    <h1 className="text-3xl font-extrabold">ChatHive</h1>
                </div>
                <div className="space-x-6">
                    <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                    {/* <Link to="/create" className="text-gray-300 hover:text-white">Create Room</Link> */}
                    <Link to="/join" className="text-gray-300 hover:text-white">Room List</Link>
                </div>
            </nav>

            {/* Create Room Section */}
            <section className="text-center max-w-3xl mx-auto py-10 px-4">
                <h2 className="text-4xl font-bold text-white mb-4">Create Your Own Chat Room</h2>
                <p className="text-lg text-gray-300 mb-6">Start your own chat room and invite others to join the conversation.</p>
            </section>

            <main className="max-w-5xl mx-auto p-6 bg-gray-800 shadow-xl rounded-lg mt-6">
                <h3 className="text-2xl font-semibold text-white mb-6">Create a New Room</h3>
                {message && <p className="text-gray-300 text-center mb-4">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            value={roomName} 
                            onChange={(e) => setRoomName(e.target.value)} 
                            placeholder="Enter room name" 
                            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition transform hover:scale-105"
                    >
                        <FaPlusCircle />
                        <span>Create Room</span>
                    </button>
                </form>
            </main>

            {/* Footer */}
            <footer className="max-w-5xl mx-auto text-center text-gray-400 mt-10 py-6 border-t border-gray-700">
                <p>&copy; {new Date().getFullYear()} ChatHive. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default CreateRoom;
