import { Link, useNavigate } from "react-router-dom";
import { FaComments, FaUsers, FaRocket, FaLock } from "react-icons/fa";
import { useEffect } from "react";
import { clearAuthData } from "../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user)
  const navigate = useNavigate();

    useEffect(() => {
    if (!user) {
        navigate("/",{ replace: true });
    }
    }, [user,navigate]);

  const handleLogout = () => {
    // Remove tokens and user data
    localStorage.removeItem("user");
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("REFRESH_TOKEN");

    // Clear Redux state
    dispatch(clearAuthData());
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
                    {/* <Link to="/create" className="text-gray-300 hover:text-white">Create Room</Link>
                    <Link to="/join" className="text-gray-300 hover:text-white">Room List</Link> */}
                    {/* <Link to="/login" className="text-gray-300 hover:text-white">Login</Link> */}
                    {!user ? (
            <Link to="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
          ) : (
            <>
                    <Link to="/create" className="text-gray-300 hover:text-white">Create Room</Link>
                    <Link to="/join" className="text-gray-300 hover:text-white">Room List</Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Logout
            </button>
            </>
          )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto py-16 px-4">
                <h2 className="text-5xl font-bold text-white mb-6">Welcome to ChatHive</h2>
                <p className="text-lg text-gray-300 mb-8">
                    Connect with people, share ideas, and enjoy real-time conversations. 
                    Join an existing chat room or create your own!
                </p>
                <div className="flex justify-center space-x-6">


{!user ? (
  <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition transform hover:scale-105">
              Login to get started....
            </Link>
          ) : (
            <>

                    <Link 
                        to="/join" 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition transform hover:scale-105"
                    >
                        Join a Room
                    </Link>
                    <Link 
                        to="/create" 
                        className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg text-lg transition transform hover:scale-105"
                    >
                        Create a Room
                    </Link>


</> )}

                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-5xl mx-auto py-12 px-6">
                <h3 className="text-3xl font-bold text-white text-center mb-8">How It Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h4 className="text-2xl font-semibold mb-2">🔹 Join a Room</h4>
                        <p className="text-gray-300">
                            Explore a variety of public chat rooms. Connect with people 
                            sharing similar interests and start meaningful conversations instantly.
                        </p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                        <h4 className="text-2xl font-semibold mb-2">🔹 Create a Room</h4>
                        <p className="text-gray-300">
                            Want a private discussion? Create your own chat room and 
                            invite others to join a space curated for your interests.
                        </p>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="bg-gray-800 py-12">
                <h3 className="text-3xl font-bold text-white text-center mb-8">Why Choose ChatHive?</h3>
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
                    <div className="p-6 text-center">
                        <FaUsers size={50} className="text-blue-500 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold mb-2">Community-Driven</h4>
                        <p className="text-gray-300">Engage in interactive discussions with a global community.</p>
                    </div>
                    <div className="p-6 text-center">
                        <FaRocket size={50} className="text-green-500 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold mb-2">Fast & Reliable</h4>
                        <p className="text-gray-300">Enjoy smooth and real-time conversations without any lag.</p>
                    </div>
                    <div className="p-6 text-center">
                        <FaLock size={50} className="text-red-500 mx-auto mb-4" />
                        <h4 className="text-xl font-semibold mb-2">Secure & Private</h4>
                        <p className="text-gray-300">Your data and chats are encrypted and fully secure.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
