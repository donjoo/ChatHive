"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api";
import { useDispatch, useSelector } from "react-redux";
import { setAuthData,clearAuthData } from "../../redux/auth/authSlice";
import { FaPaperPlane, FaComments } from "react-icons/fa";
import { toast } from "sonner";

function Chat() {
    const currentUser = useSelector((state) => state.auth.user);
    const { roomName } = useParams();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!currentUser) {
            const storedUserData = localStorage.getItem('user');
            const storedToken = localStorage.getItem('ACCESS_TOKEN');
    
            if (storedUserData && storedToken) {
                try {
                    const parsedUserData = JSON.parse(storedUserData);
                    dispatch(setAuthData({ user: parsedUserData, token: storedToken }));
                } catch (error) {
                    console.log('Error parsing user data:', error);
                }
            }
        }
    }, [dispatch, currentUser]);

    const attemptReconnect = () => {
    console.log("🔁 Attempting to reconnect in 3 seconds...");

    setTimeout(() => {
        if (!navigator.onLine) {
        console.warn("⚠️ Still offline. Skipping reconnect.");
        return;
        }

        // Try to open the socket again
        const token = localStorage.getItem("ACCESS_TOKEN");
        if (!token) return;

        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
        const newSocket = new WebSocket(`${wsProtocol}://chathive-56su.onrender.com/ws/chat/${roomName}/?token=${token}`);
        
        // Attach new listeners
        newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.error || data.message === "Token is invalid or expired") {
            console.warn("❌ Auth issue on reconnect");
            return;
        }
        setMessages(prev => [...prev, data]);
        };

        newSocket.onerror = (e) => {
        console.error("WebSocket reconnect error:", e);
        };

        newSocket.onclose = () => {
        console.warn("❌ Reconnect failed. Trying again...");
        attemptReconnect(); // 🔁 try again
        };

        // Replace old socket
        setSocket(newSocket);
    }, 5000); // wait 3 seconds before trying
    };

    
    useEffect(() => {
            const token = localStorage.getItem("ACCESS_TOKEN");

            if (!token) {
                console.warn("No token found for WebSocket connection");
                return;
            }


        const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
        const ws = new WebSocket(`${wsProtocol}://chathive-56su.onrender.com/ws/chat/${roomName}/?token=${token}`);        
        setSocket(ws);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.message === "Token is invalid or expired" || data.error) {
            console.warn("Received server error:", data);
            toast.error("Session expired. Please log in again.");
            dispatch(clearAuthData());
            navigate("/", { replace: true });
            return;
        }

            setMessages((prev) => [...prev, data]);
        };


        ws.onclose = (event) => {
        console.warn("WebSocket connection closed:", event);
        // toast.error("connection was closed. Please log in again.");
        setSocket(null); // prevent future sends
        if (event.code !== 1000) {
        toast.warning("Lost connection. Trying to reconnect...");
        }
        attemptReconnect(); // 👈 try again

        };

        ws.onerror = (event) => {
            console.error("WebSocket error:", event);
            toast.error("⚠️ connection error occurred. Messages may not be sent.");
        };
        api.get(`messages/${roomName}/`).then((res) => {
            setMessages(res.data.messages);
        });

        return () => ws.close();
    }, [roomName]);

const sendMessage = () => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
        toast.error("⚠️ Connection lost. Unable to send message.");
        console.warn("❌ WebSocket is not open. Message not sent.");
        attemptReconnect(); 
        return;
    }

    if (message.trim() === "") {
        return; // don't send empty messages
    }

    try {
        socket.send(
            JSON.stringify({ 
                message, 
                username: currentUser?.username, 
                room: roomName  
            })
        );
        setMessage("");
    } catch (error) {
        console.error("🚨 Failed to send message:", error);
        toast.error("❌ Failed to send message. Please try again.");
        attemptReconnect(); 
    }
};



        const formatTime = (timestamp) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };


    return (
        <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center">
            {/* Navbar */}
            <nav className="w-full bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50">
                <div className="max-w-5xl mx-auto flex justify-between items-center py-4 px-6">
                    <div className="flex items-center space-x-3">
                        <FaComments size={28} className="text-blue-500" />
                        <h1 className="text-3xl font-extrabold">ChatHive</h1>
                    </div>
                    <div className="space-x-6">
                        <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                        <Link to="/create" className="text-gray-300 hover:text-white">Create Room</Link>
                        <Link to="/join" className="text-gray-300 hover:text-white">Room List</Link>
                    </div>
                </div>
            </nav>

            {/* Chat Room Container */}
            <div className="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-xl mt-20">
                <h2 className="text-3xl font-bold text-center mb-4">Chat Room: {roomName}</h2>
                <div className="overflow-y-auto h-96 p-4 bg-gray-700 rounded-lg mb-4 space-y-2">
         {messages.map((msg, index) => (
    <div 
        key={index} 
        className={`p-3 rounded-lg ${msg.username === currentUser.username ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-600'} max-w-xs`}
    >
        <div className="text-sm font-semibold">
            {msg.username || msg.sender__username}
        </div>
        <div className="text-sm">{msg.message || msg.content}</div>
        {msg.timestamp && (
                                <div className="text-xs text-gray-300 mt-1 text-right">
                                    {formatTime(msg.timestamp)}
                                </div>
                            )}
    </div>
))}
                </div>
                <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button 
                        onClick={sendMessage} 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition transform hover:scale-105"
                    >
                        <FaPaperPlane />
                        <span>Send</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Chat;
