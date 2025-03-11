import { useState } from "react";
import api from "../../api";

const CreateGroup = ({ onGroupCreated }) => {
    const [groupName, setGroupName] = useState("");

    const handleCreateGroup = async () => {
        if (!groupName) return;
        try {
            const response = await api.post("/chat/create_group/", { group_name: groupName });
            alert(`Group created! Share this ID: ${response.data.group_id}`);
            onGroupCreated(response.data.group_id);
        } catch (error) {
            console.log("Error creating group:", error);
        }
    };

    return (
        <div className="p-4">
            <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="border p-2 rounded"
            />
            <button onClick={handleCreateGroup} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
                Create Group
            </button>
        </div>
    );
};

export default CreateGroup;
