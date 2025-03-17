import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import { FaComments } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { setAuthData } from "../../redux/auth/authSlice";

const RoomList = () => {
    const [rooms, setRooms] = useState([]);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user)
  

    useEffect(() =>{
      if (!user){
        const storeduserdata = localStorage.getItem('user')
        if (storeduserdata){
          try{
    
              console.log('jeyyy')
              const parsedUserData = JSON.parse(storeduserdata);
              dispatch(setAuthData({user : parsedUserData}));
          } catch (error){
            console.log('`Error  prasing user data: ', error)
          }
        }
      }
    },[dispatch,user])
  

    useEffect(() => {
        api.get("list-rooms/").then((res) => setRooms(res.data.rooms));
    }, []);

    return (
        <div className="bg-gray-900 text-white min-h-screen">
            {/* Navbar */}
            <nav className="bg-gray-800 shadow-md">
                <div className="max-w-5xl mx-auto flex justify-between items-center py-4 px-6">
                    <div className="flex items-center space-x-3">
                        <FaComments size={28} className="text-blue-500" />
                        <h1 className="text-3xl font-extrabold">ChatHive</h1>
                    </div>
                    <div className="space-x-6">
                        <Link to="/" className="text-gray-300 hover:text-white">Home</Link>
                        <Link to="/create" className="text-gray-300 hover:text-white">Create Room</Link>
                        {/* <Link to="/room-list" className="text-gray-300 hover:text-white">Room List</Link> */}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto py-10 px-4">
                <h2 className="text-4xl font-bold text-white mb-4">Join a Chat Room and Start Conversations</h2>
                <p className="text-lg text-gray-300 mb-6">Find a room that suits your interest and chat with like-minded people.</p>
            </section>
            
            {/* Room List */}
            <main className="max-w-5xl mx-auto p-6 bg-gray-800 shadow-xl rounded-lg mt-6">
                <h3 className="text-2xl font-semibold text-white mb-6">Available Rooms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.length > 0 ? (
                        rooms.map((room) => (
                            <Link 
                                key={room.id} 
                                to={`/chat/${room.name}`} 
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
                            >
                                <span className="font-medium text-lg">{room.name}</span>
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-300 text-center col-span-3">No rooms available.</p>
                    )}
                </div>
            </main>
            
            {/* Footer */}
            <footer className="max-w-5xl mx-auto text-center text-gray-400 mt-10 py-6 border-t border-gray-700">
                <p>&copy; {new Date().getFullYear()} ChatHive. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default RoomList;
