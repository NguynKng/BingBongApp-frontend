import { Bell, CircleUserRound, House, Logs, MessageCircleMore, MonitorPlay, Search, Store, UserRound, UsersRound } from "lucide-react"

function Header(){
    return (
        <header className={`fixed w-full min-h-[10vh] flex justify-between gap-2 items-center z-10 px-2 border-b-2 border-gray-200`}>
            <div className="flex items-center gap-2">
                <img src="/facebook-logo.webp" alt="facebook-logo" className="size-10 object-cover"/>
                <div className="relative w-[16rem]">
                    <Search className="absolute size-5 top-3 left-3 text-gray-500" />
                    <input type="text" placeholder="Tìm kiếm trên facebook" className="text-gray-700 w-full h-full py-3 pl-10 bg-gray-100 rounded-full focus:outline-none"/>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="py-4 px-12 border-b-4 border-blue-500">
                    <House />
                </div>
                <div className="py-4 px-12 border-b-4 border-blue-500">
                    <UsersRound />
                </div>
                <div className="py-4 px-12 border-b-4 border-blue-500">
                    <MonitorPlay />
                </div>
                <div className="py-4 px-12 border-b-4 border-blue-500">
                    <Store />
                </div>
                <div className="py-4 px-12 border-b-4 border-blue-500">
                    <CircleUserRound />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="bg-gray-300 rounded-full size-10 p-2.5 flex items-center justify-center">
                    <Logs />
                </div>
                <div className="bg-gray-300 rounded-full size-10 p-2.5">
                    <img src="/messenger-icon.png" className="size-full object-cover" />
                </div>
                <div className="bg-gray-300 rounded-full size-10 p-2.5 flex items-center justify-center">
                    <Bell className="fill-black" />
                </div>
                <div className="bg-gray-300 rounded-full size-10 flex items-center justify-center">
                    <UserRound />
                </div>
            </div>
        </header>
    )
}

export default Header