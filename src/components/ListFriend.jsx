import { Ellipsis, Search } from "lucide-react";
import { useGetProfile } from "../hooks/useProfile";
import useAuthStore from "../store/authStore";
import SpinnerLoading from "../components/SpinnerLoading";
import { useEffect, useState } from "react";
import Config from "../envVars";

function ListFriend({ onToggleChat }) {
    const { user } = useAuthStore();
    const { profile, loading } = useGetProfile(user?._id || '');
    const [friends, setFriends] = useState([]);
    useEffect(() => {
        if (profile?.friends) {
            setFriends(profile.friends);
        }
    }, [profile]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-200">
                <SpinnerLoading />
            </div>
        );
    }
    
    return (
        <div className="fixed px-4 overflow-y-auto max-h-[92vh] custom-scroll">
            <div className="py-4 border-b-2 border-gray-300">
                <h1 className="text-lg text-gray-500">Sponsored</h1>
                <div className="mt-4 space-y-4">
                    <div className="flex items-center gap-2">
                        <img src="/ads/ads-1.jpg" className="size-[9rem] object-cover" />
                        <div className="text-[15px]">
                            <h1 className="font-semibold">Ajinomoto Việt Nam</h1>
                            <p className="text-gray-500">zalo.me</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src="/ads/ads-2.jpg" className="size-[9rem] object-cover" />
                        <div className="text-[15px]">
                            <h1 className="font-semibold">Get reward for your academic excellence!</h1>
                            <p className="text-gray-500">zalo.me</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-gray-500 text-lg">Contacts</h1>
                    <div className="flex items-center gap-4">
                        <div className="hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer">
                            <Search className="size-5 text-gray-500" />
                        </div>
                        <div className="hover:bg-gray-200 rounded-full size-8 flex items-center justify-center cursor-pointer">
                            <Ellipsis className="size-5 text-gray-500" />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    {friends.map((friend) => (
                        <div key={friend._id} className="flex items-center gap-2 hover:bg-gray-200 rounded-lg px-2 py-2 cursor-pointer transition" onClick={() => onToggleChat(friend)}>
                            <div className="size-10 relative rounded-full">
                                <img
                                    src={friend.avatar ? `${Config.BACKEND_URL}${friend.avatar}` : "/user.png"}
                                    alt={friend.firstName}
                                    className="size-full rounded-full object-cover border"
                                />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <h2 className="text-[15px] font-semibold">{`${friend.fullName}`}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ListFriend;