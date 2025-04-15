import Config from "../envVars";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";

function DropdownUser() {
    const { logout, user } = useAuthStore()
    const handleLogout = async () => {
        await logout()
    }
    const footerLinks = [
        "Privacy",
        "Terms",
        "Advertising",
        "Ad choices",
        "Cookies",
        "More",
        "Meta © 2025"
    ];
    return (
        <div className="absolute top-[110%] right-0 min-w-92 rounded-lg shadow-lg border-2 border-gray-200 bg-white p-3">
            {/* User */}
            <div className="shadow-lg p-1 w-full rounded-lg border-2 border-gray-200">
                <Link to="/profile" className="p-2 hover:bg-gray-100 w-full flex items-center gap-2 rounded-lg cursor-pointer">
                    <img src={user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : '/user.png'} className="size-9 object-cover rounded-full border-2 border-gray-200" />
                    <span className="text-[17px]">{`${user.fullName}`}</span>
                </Link>
                <div className="w-full py-1 px-2">
                    <div className="w-full border-1 border-gray-300"></div>
                </div>
                <div className="w-full p-2">
                    <button className="rounded-md bg-gray-200 hover:bg-gray-300 flex items-center justify-center gap-2 w-full cursor-pointer py-2 px-4">
                        <img src="/change-account.png" className="size-5 object-cover" />
                        <span className="font-medium">Xem tất cả trang cá nhân</span>
                    </button>
                </div>
            </div>
            {/* Setting */}
            <div className="mt-4">
                {/* Setting and privacy */}
                <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer">
                    <div className="p-2 rounded-full bg-gray-300">
                        <img src="/settings.png" className="size-5 object-cover" />
                    </div>
                    <span className="font-medium">Cài đặt và quyền riêng tư</span>
                </div>
                {/* Help and support */}
                <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer">
                    <div className="p-2 rounded-full bg-gray-300">
                        <img src="/help-web-button.png" className="size-5 object-cover" />
                    </div>
                    <span className="font-medium">Trợ giúp và hỗ trợ</span>
                </div>
                {/* Display and accessibility */}
                <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer">
                    <div className="p-2 rounded-full bg-gray-300">
                        <img src="/moon.png" className="size-5 object-cover" />
                    </div>
                    <span className="font-medium">Màn hình & trợ năng</span>
                </div>
                {/* Give feedback */}
                <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer">
                    <div className="p-2 rounded-full bg-gray-300">
                        <img src="/feedback.png" className="size-5 object-cover" />
                    </div>
                    <span className="font-medium">Đóng góp ý kiến</span>
                </div>
                {/* Logout */}
                <div className="rounded-md hover:bg-gray-100 flex items-center gap-2 p-2 cursor-pointer" onClick={handleLogout}>
                    <div className="p-2 rounded-full bg-gray-300">
                        <img src="/logout.png" className="size-5 object-cover" />
                    </div>
                    <span className="font-medium">Đăng xuất</span>
                </div>
            </div>
            {/* Privacy Term */}
            <div className="mt-4 flex flex-wrap items-center gap-1 text-gray-500 text-[13px] leading-4">
            {footerLinks.map((label, index) => (
                <div key={label} className="flex items-center">
                    <Link to="#" className="hover:underline">{label}</Link>
                    {index < footerLinks.length - 1 && (
                        <span className="mx-1 text-gray-400">•</span>
                    )}
                </div>
            ))}
            </div>
        </div>
    )
}

export default DropdownUser