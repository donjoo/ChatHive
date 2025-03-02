import { useEffect, useState } from "react";
import ChatRoom from "./ChatRoom";
import api from "../../api";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [chat, setChat] = useState(null);
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
    const [showUsers, setShowUsers] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const userlist = async () => {
        try {
            const response = await api.get("users/list/");
            setUsers(response.data);
            console.log("data :", response.data);
        } catch (error) {
            console.log("error fetching user list");
        }
    };

    useEffect(() => {
        userlist();
    }, []);

    const handleClick = (user) => {
        setChat(user);
        if (isMobileView) setShowUsers(false);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            {(!isMobileView || showUsers) && (
                <div className="w-full md:w-1/4 bg-white shadow-lg p-4 border-r border-gray-300">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Users</h2>
                    <ul className="space-y-2">
                        {users.map((user) => (
                            <li
                                key={user.id}
                                onClick={() => handleClick(user)}
                                className="flex items-center p-3 cursor-pointer hover:bg-blue-100 rounded-md transition duration-200 ease-in-out border border-gray-200 shadow-sm"
                            >
                                <div className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-full text-sm font-semibold">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <span className="ml-3 text-gray-800 font-medium">{user.username}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Chat Area */}
            {(!isMobileView || !showUsers) && (
                <div className="flex-1 flex flex-col">
                    <button
                        className="p-2 bg-gray-200 md:hidden text-blue-600 font-semibold"
                        onClick={() => setShowUsers(true)}
                    >
                        Back to Users
                    </button>
                    <ChatRoom receiverUsername={chat?.username} />
                </div>
            )}
        </div>
    );
}
