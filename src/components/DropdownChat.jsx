import { Ellipsis, Expand, Search, SquarePen } from "lucide-react";

function DropdownChat({ onToggleChat }) {
    const chats = [
        {
            id: "1",
            name: "Nguyễn Nguyện",
            avatar: "/avatar/avatar-1.png",
            message: "Hey, how are you?",
            time: "2h ago",
        },
        {
            id: "2",
            name: "Long Quang Trương",
            avatar: "/avatar/avatar-3.png",
            message: "Let's meet tomorrow!",
            time: "1d ago",
        },
        {
            id: "3",
            name: "Cristiano Ronaldo",
            avatar: "/avatar/avatar-4.png",
            message: "Check this out ⚽",
            time: "Just now",
        },
        {
            id: "4",
            name: "Cristiano Ronaldo",
            avatar: "/avatar/avatar-4.png",
            message: "Check this out ⚽",
            time: "Just now",
        },
        {
            id: "5",
            name: "Cristiano Ronaldo",
            avatar: "/avatar/avatar-4.png",
            message: "Check this out ⚽",
            time: "Just now",
        },
        {
            id: "6",
            name: "Cristiano Ronaldo",
            avatar: "/avatar/avatar-4.png",
            message: "Check this out ⚽",
            time: "Just now",
        },
        {
            id: "7",
            name: "Cristiano Ronaldo",
            avatar: "/avatar/avatar-4.png",
            message: "Check this out ⚽",
            time: "Just now",
        },
        {
            id: "8",
            name: "Cristiano Ronaldo",
            avatar: "/avatar/avatar-4.png",
            message: "Check this out ⚽",
            time: "Just now",
        },
        {
            id: "9",
            name: "Cristiano Ronaldo",
            avatar: "/avatar/avatar-4.png",
            message: "Check this out ⚽",
            time: "Just now",
        }
    ];
    return (
        <div className="absolute top-[110%] right-0 min-w-96 rounded-xl shadow-2xl border border-gray-200 bg-white p-4 space-y-5 animate-fade-in transform transition-all duration-300 ease-in-out">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
                <h1 className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-md">
                    Đoạn chat
                </h1>
                <div className="flex items-center gap-2">
                    <div className="bg-white hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer transition duration-200 transform hover:scale-110">
                        <Ellipsis className="size-5 text-gray-500" />
                    </div>
                    <div className="bg-white hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer transition duration-200 transform hover:scale-110">
                        <Expand className="size-5 text-gray-500" />
                    </div>
                    <div className="bg-white hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer transition duration-200 transform hover:scale-110">
                        <SquarePen className="size-5 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative w-full">
                <Search className="absolute size-5 top-2.5 left-3 text-gray-500" />
                <input
                    type="text"
                    placeholder="Tìm kiếm trên messenger"
                    className="text-gray-900 w-full py-2 pl-10 bg-gray-100 rounded-full focus:outline-none text-sm shadow-inner"
                />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-2">
                <h1 className="py-2 px-4 bg-blue-100 font-medium hover:bg-blue-200 cursor-pointer text-blue-600 rounded-full shadow-sm transition">
                    Hộp thư
                </h1>
                <h1 className="py-2 px-4 bg-gray-100 font-medium cursor-pointer hover:bg-gray-200 text-gray-800 rounded-full shadow-sm transition">
                    Cộng đồng
                </h1>
            </div>

            {/* Chat List */}
            <div className="space-y-2 max-h-[28rem] custom-scroll overflow-y-auto pr-1 custom-scrollbar">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        onClick={onToggleChat}
                        className="flex items-center gap-3 hover:bg-gray-100 rounded-xl px-3 py-2 cursor-pointer transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md"
                    >
                        <img
                            src={chat.avatar}
                            alt={chat.name}
                            className="size-10 rounded-full object-cover border border-gray-300 shadow-sm"
                        />
                        <div className="flex-1">
                            <h2 className="text-sm font-semibold text-gray-800">{chat.name}</h2>
                            <p className="text-xs text-gray-500 truncate">{chat.message}</p>
                        </div>
                        <span className="text-xs text-gray-400">{chat.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DropdownChat;