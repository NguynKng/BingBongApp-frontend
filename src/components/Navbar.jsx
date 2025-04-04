import { UsersRound } from "lucide-react"
import { Link } from "react-router-dom"

function Navbar(){
    return (
        <nav className="fixed top-[10vh] left-0 h-[90vh] w-[25%] bg-gray-100 px-4 py-4 overflow-y-auto z-40 hidden lg:block">
            <div className="space-y-2">
                <div className="flex gap-2 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                    <img src="/user.png" className="size-8 object-cover rounded-full bg-gray-300 border-2 border-gray-300" />
                    <span className="font-medium">Nguyên Khang</span>
                </div>
                <div className="flex gap-2 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                    <img src="/two-people.png" className="size-8 object-cover" />
                    <span className="font-medium">Bạn bè</span>
                </div>
                <div className="flex gap-2 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                    <img src="/clock.png" className="size-8 object-cover" />
                    <span className="font-medium">Kỷ niệm</span>
                </div>
                <div className="flex gap-2 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                    <img src="/bookmark.png" className="size-8 object-cover" />
                    <span className="font-medium">Đã lưu</span>
                </div>
                <div className="flex gap-2 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                    <img src="/group.png" className="size-8 object-cover" />
                    <span className="font-medium">Nhóm</span>
                </div>
                <div className="flex gap-2 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                    <img src="/video.png" className="size-8 object-cover" />
                    <span className="font-medium">Video</span>
                </div>
                <div className="flex gap-2 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                    <img src="/shops.png" className="size-8 object-cover" />
                    <span className="font-medium">Marketplace</span>
                </div>
                <div className="flex gap-2 items-center hover:bg-gray-200 p-2 rounded-md cursor-pointer">
                    <img src="/feed.png" className="size-8 object-cover" />
                    <span className="font-medium">Bảng feed</span>
                </div>
            </div>
        </nav>
    )
}

export default Navbar