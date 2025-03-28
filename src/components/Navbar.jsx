import { UsersRound } from "lucide-react"
import { Link } from "react-router-dom"

function Navbar(){

    return (
        <nav className={`fixed flex flex-col gap-6 min-h-[90vh] left-0 bottom-0 bg-gray-100 z-50 lg:w-[25%] w-[50%] py-4 pl-4`}>
            <div className="flex gap-2 items-center">
                <img src="/user-none.webp" className="size-8 object-cover rounded-full bg-gray-300" />
                <span className="font-medium">Nguyên Khang</span>
            </div>
            <div className="flex gap-2 items-center">
                <img src="/two-people.png" className="size-8 object-cover" />
                <span className="font-medium">Bạn bè</span>
            </div>
            <div className="flex gap-2 items-center">
                <img src="/clock.png" className="size-8 object-cover" />
                <span className="font-medium">Kỷ niệm</span>
            </div>
            <div className="flex gap-2 items-center">
                <img src="/bookmark.png" className="size-8 object-cover" />
                <span className="font-medium">Đã lưu</span>
            </div>
            <div className="flex gap-2 items-center">
                <img src="/group.png" className="size-8 object-cover" />
                <span className="font-medium">Nhóm</span>
            </div>
            <div className="flex gap-2 items-center">
                <img src="/video.png" className="size-8 object-cover" />
                <span className="font-medium">Video</span>
            </div>
            <div className="flex gap-2 items-center">
                <img src="/shops.png" className="size-8 object-cover" />
                <span className="font-medium">Marketplace</span>
            </div>
            <div className="flex gap-2 items-center">
                <img src="/feed.png" className="size-8 object-cover" />
                <span className="font-medium">Bảng feed</span>
            </div>
        </nav>
    )
}

export default Navbar