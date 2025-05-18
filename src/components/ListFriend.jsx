import { Ellipsis, Search } from "lucide-react";
import { useGetProfile } from "../hooks/useProfile";
import useAuthStore from "../store/authStore";
import SpinnerLoading from "../components/SpinnerLoading";
import { useEffect, useState } from "react";
import Config from "../envVars";

function ListFriend({ onToggleChat }) {
    const { user, onlineUsers } = useAuthStore();
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
        <div className="fixed px-4 overflow-y-auto min-h-[92vh] max-h-[92vh] custom-scroll">
            {/* Sponsored Section */}
            <div className="py-4 border-b-2 border-gray-300 dark:border-gray-500">
                <h1 className="text-lg text-gray-600 dark:text-gray-400">Sponsored</h1>
                <div className="mt-1 space-y-2">
                    {[1, 2].map((ad, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 hover:bg-gray-200 rounded-lg transition-all cursor-pointer dark:hover:bg-[rgb(56,56,56)]">
                            <img
                                src={`/ads/ads-${ad}.jpg`}
                                className="size-[8rem] rounded-lg object-cover"
                                alt={`Ad ${ad}`}
                            />
                            <div className="flex flex-col">
                                <h2 className="text-[15px] font-semibold leading-5 dark:text-white">
                                    {ad === 1 ? 'Ajinomoto Việt Nam' : 'Get reward for your academic excellence!'}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">zalo.me</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contacts Section */}
            <div className="py-4">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-gray-600 text-lg font-semibold dark:text-gray-400">Contacts</h1>
                    <div className="flex items-center gap-3">
                        <div className="hover:bg-gray-300 bg-white/70 rounded-full size-9 flex items-center justify-center shadow cursor-pointer transition dark:hover:bg-[rgb(56,56,56)]">
                            <Search className="size-5 text-gray-600" />
                        </div>
                        <div className="hover:bg-gray-300 bg-white/70 rounded-full size-9 flex items-center justify-center shadow cursor-pointer transition dark:hover:bg-[rgb(56,56,56)]">
                            <Ellipsis className="size-5 text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* List of Friends */}
                <div className="space-y-2">
                    {friends.map((friend) => (
                        <div key={friend._id} className="flex items-center gap-2 hover:bg-gray-200 rounded-lg px-2 py-2 cursor-pointer transition dark:hover:bg-[rgb(56,56,56)]" onClick={() => onToggleChat(friend)}>
                            <div className="size-10 relative rounded-full">
                                <img
                                    src={friend.avatar ? `${Config.BACKEND_URL}${friend.avatar}` : "/user.png"}
                                    alt={friend.firstName}
                                    className="size-full rounded-full object-cover"
                                />
                                {onlineUsers.includes(friend._id) && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                )}
                            </div>
                            <h2 className="text-[15px] font-semibold dark:text-white">{`${friend.fullName}`}</h2>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ListFriend;
