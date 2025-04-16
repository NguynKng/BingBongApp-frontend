import { Ellipsis, Expand, Search, SquarePen } from "lucide-react";

function DropdownChat({ onToggleChat }){
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
        <div className="absolute top-[110%] right-0 min-w-92 rounded-lg shadow-lg border-2 border-gray-200 bg-white p-3 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
                <h1 className="text-2xl font-bold">Đoạn chat</h1>
                <div className="flex items-center gap-2">
                    <div className="bg-white hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer group">
                        <Ellipsis className="size-5 text-gray-500" />
                    </div>
                    <div className="bg-white hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer group">
                        <Expand className="size-5 text-gray-500" />
                    </div>
                    <div className="bg-white hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer group">
                        <SquarePen className="size-5 text-gray-500" />
                    </div>
                </div>
            </div>
            {/* Search */}
            <div className="relative w-full">
                <Search className="absolute size-5 top-2.5 left-3 text-gray-500" />
                <input type="text" placeholder="Tìm kiếm trên messenger" className="text-gray-900 w-full py-2 pl-10 bg-gray-100 rounded-full focus:outline-none text-sm"/>
            </div>
                {/* Tabs */}
            <div className="flex items-center gap-2">
                <h1 className="py-2 px-3 bg-blue-200 font-medium hover:bg-gray-200 cursor-pointer text-blue-500 rounded-full">Hộp thư</h1>
                <h1 className="py-2 px-3 bg-white font-medium cursor-pointer hover:bg-gray-200 text-black rounded-full">Cộng đồng</h1>
            </div>
            {/* Chat List */}
            <div className="space-y-2 max-h-[30rem] overflow-y-auto">
                {chats.map((chat) => (
                <div
                    key={chat.id}
                    className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-2 py-2 cursor-pointer transition" onClick={onToggleChat}
                >
                    <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="size-10 rounded-full object-cover border"
                    />
                    <div className="flex-1">
                        <h2 className="text-sm font-semibold">{chat.name}</h2>
                        <p className="text-xs text-gray-500 truncate">{chat.message}</p>
                    </div>
                    <span className="text-xs text-gray-400">{chat.time}</span>
                </div>
                ))}
            </div>
        </div>
    )
}

export default DropdownChat;