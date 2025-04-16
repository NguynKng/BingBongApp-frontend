import { useState, useRef } from "react";
import Header from "../components/Header";
import Meta from "../components/Meta";
import { ChevronDown, Ellipsis, Plus } from "lucide-react";
import friends from "../data/friends";
import CreateStatus from "../components/CreateStatus";
import PostCard from "../components/PostCard";
import test_posts from "../data/posts";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Config from "../envVars";
import { userAPI } from "../services/api"; // Import from consolidated API
import { toast } from "react-hot-toast";
import { useGetUserPosts } from "../hooks/usePosts"; 

function ProfilePage() {
    const [activeTab, setActiveTab] = useState("Bài viết");
    const [isUploading, setIsUploading] = useState({ avatar: false, coverPhoto: false });
    const { user, updateUser } = useAuthStore();
    const avatarInputRef = useRef(null);
    const coverPhotoInputRef = useRef(null);
    const { posts } = useGetUserPosts(user?._id) // Fetch user posts using custom hook

    const tabs = [
        { name: "Bài viết" },
        { name: "Giới thiệu" },
        { name: "Bạn bè" },
        { name: "Ảnh" },
        { name: "Video" },
        { name: "Check in" }
    ];

    const handleAvatarUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setIsUploading(prev => ({ ...prev, avatar: true }));
            const response = await userAPI.uploadAvatar(file);
            
            // Update user avatar in store
            updateUser({ avatar: response.user.avatar });
            toast.success("Avatar updated successfully");
        } catch (error) {
            console.error("Avatar upload error:", error);
        } finally {
            setIsUploading(prev => ({ ...prev, avatar: false }));
        }
    };

    const handleCoverPhotoUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        try {
            setIsUploading(prev => ({ ...prev, coverPhoto: true }));
            const response = await userAPI.uploadCoverPhoto(file);
            
            // Update user cover photo in store
            updateUser({ coverPhoto: response.user.coverPhoto });
            toast.success("Cover photo updated successfully");
        } catch (error) {
            console.error("Cover photo upload error:", error);
        } finally {
            setIsUploading(prev => ({ ...prev, coverPhoto: false }));
        }
    };

    return (
        <>
<<<<<<< HEAD
            <Meta title="Bing Bong" />
=======
            <Meta title="BingBong" />
>>>>>>> 87a741aac8efa0f8147c7b775143503dad2f47ef
            <Header />
            {/*Section 1*/}
            <section className="pt-[10vh] px-[15%]">
                <div className="relative h-[38rem]">
                    {/*Cover Photo*/}
                    <div className="relative w-full h-[71%] rounded-b-md">
                        <img 
                            src={user?.coverPhoto ? `${Config.BACKEND_URL}${user.coverPhoto}` : "/background-gray.avif"} 
                            className="size-full rounded-b-md object-cover" 
                            alt="Cover photo"
                        />
                        {/* Hidden file input for cover photo */}
                        <input 
                            type="file" 
                            ref={coverPhotoInputRef}
                            onChange={handleCoverPhotoUpload}
                            accept="image/*"
                            className="hidden"
                        />
                        {/* Cover Photo Upload Button */}
                        <div 
                            className="absolute bottom-4 right-8 z-31 flex items-center gap-2 bg-white hover:bg-gray-300 cursor-pointer rounded-md py-2 px-4 text-black font-medium"
                            onClick={() => coverPhotoInputRef.current.click()}
                        >
                            <img src="/camera.png" className="size-4 object-cover" />
                            <span>{isUploading.coverPhoto ? "Uploading..." : user?.coverPhoto ? "Thay ảnh bìa" : "Thêm ảnh bìa"}</span>
                        </div>
                    </div>
                    {/*Profile Container*/}
                    <div className="absolute w-full -bottom-1">
                        <div className="relative w-full">
                            <div className="absolute top-0 w-full bg-gradient-to-t from-black/50 to-transparent h-[30%] rounded-md"></div>
                            {/*Profile*/}
                            <div className="px-8">
                                <div className="flex justify-between border-b-2 border-gray-200 pb-4">
                                    {/*Profile Info*/}
                                    <div className="flex gap-2">
                                        {/*Avatar*/}
                                        <div className="relative bg-gray-200 hover:bg-gray-300 rounded-full size-46 flex border-4 border-white items-center justify-center">
                                            <img 
                                                src={user?.avatar ? `${Config.BACKEND_URL}${user.avatar}` : "/user.png"} 
                                                className="size-full rounded-full object-cover cursor-pointer hover:opacity-70"
                                                alt="Avatar" 
                                            />
                                            {/* Hidden file input for avatar */}
                                            <input 
                                                type="file" 
                                                ref={avatarInputRef}
                                                onChange={handleAvatarUpload}
                                                accept="image/*"
                                                className="hidden" 
                                            />
                                            <div 
                                                className="absolute bottom-4 right-0 p-2 size-9 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
                                                onClick={() => avatarInputRef.current.click()}
                                            >
                                                {isUploading.avatar ? (
                                                    <div className="size-full flex items-center justify-center">
                                                        <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                                    </div>
                                                ) : (
                                                    <img src="/camera.png" className="size-full object-cover" />
                                                )}
                                            </div>
                                        </div>
                                        {/*Info*/}
                                        <div className="flex flex-col justify-center self-end py-4 px-2">
                                            <h1 className="text-3xl font-bold">
                                                {user?.fullName}
                                            </h1>
                                            <p className="text-gray-500">120 người bạn</p>
                                        </div>
                                    </div>
                                    {/*Edit Profile Button*/}
                                    <div className="flex flex-col justify-end items-end py-4 z-30">
                                        <div className="flex gap-2 items-center">
                                            <div className="flex gap-2 bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-md py-2 px-4 text-white items-center justify-center">
                                                <Plus className="size-5" />
                                                <span>Thêm vào tin</span>
                                            </div>
                                            <div className="flex gap-2 items-center justify-center bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md py-2 px-4 text-black font-medium">
                                                <img src="/pen.png" className="size-5 object-cover" />
                                                <span>Chỉnh sửa trang cá nhân</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*Profile Bar*/}
                                <div className="flex justify-between items-center">
                                    <div className="flex py-1">
                                        {tabs.map((tab, index) => (
                                            <div key={index} className={`cursor-pointer border-b-4 font-medium py-3 px-4 ${activeTab === tab.name ? "border-blue-500 text-blue-500 bg-transparent" : "border-transparent text-gray-500 hover:bg-gray-200 rounded-md"}`} onClick={() => setActiveTab(tab.name)}>
                                                {tab.name}  
                                            </div>
                                        ))}
                                        <div className="flex gap-2 items-center justify-center hover:bg-gray-200 cursor-pointer rounded-md py-3 px-4 text-gray-500 font-medium">
                                            <span>Xem thêm</span>
                                            <ChevronDown className="size-5" />
                                        </div>
                                    </div>
                                    <div className="rounded-md text-black bg-gray-200 hover:bg-gray-300 cursor-pointer py-2 px-4">
                                        <Ellipsis className="size-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*Section 2*/}
            <section className="bg-gray-200 px-[17%] py-4">
                <div className="flex gap-4">
                    {/*Left Content*/}
                    <div className="w-[40%] space-y-4 sticky top-[8.5vh] h-fit">
                        {/*Intro*/}
                        <div className="rounded-md bg-white border-2 border-gray-200 p-4 space-y-4">
                            <h1 className="text-xl font-bold">Giới thiệu</h1>
                            <button className="py-2 px-4 text-center w-full rounded-md bg-gray-200 font-medium  cursor-pointer hover:bg-gray-300">Thêm tiểu sử</button>
                            <div className="flex gap-2 items-center">
                                <img src="/graduate.png" className="size-5" />
                                <span className="text-gray-600">Went to THPT Trần khai Nguyên</span>
                            </div>
                            <div className="flex gap-2 items-center">
                                <img src="/location-pin.png" className="size-5" />
                                <span className="text-gray-600">From Ho Chi Minh City, Vietnam</span>
                            </div>
                            <button className="py-2 px-4 text-center w-full rounded-md bg-gray-200 font-medium  cursor-pointer hover:bg-gray-300">Chỉnh sửa chi tiết</button>
                            <button className="py-2 px-4 text-center w-full rounded-md bg-gray-200 font-medium cursor-pointer hover:bg-gray-300">Thêm nội dung đáng chú ý</button>
                        </div>
                        {/*Photos*/}
                        <div className="rounded-md bg-white border-2 border-gray-200 p-4 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <h1 className="text-xl font-bold">Ảnh</h1>
                                <h1 className="text-blue-500 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-200">Xem tất cả ảnh</h1>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {test_posts.map((post) => (
                                    <div key={post.id} className="relative w-full h-32 overflow-hidden rounded-md cursor-pointer hover:scale-105 transition-transform duration-300">
                                        <img src={post.image} alt="Post" className="w-full h-full object-cover rounded-md" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/*Friends*/}
                        <div className="rounded-md bg-white border-2 border-gray-200 p-4 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <h1 className="text-xl font-bold">Bạn bè</h1>
                                <h1 className="text-blue-500 rounded-md py-2 px-4 cursor-pointer hover:bg-gray-200">Xem tất cả bạn bè</h1>
                            </div>
                            <h1 className="text-gray-500 text-lg">120 người bạn</h1>
                            <div className="grid grid-cols-3 gap-2">
                                {friends.map((friend) => (
                                    <div key={friend.id} className="w-full rounded-md">
                                        <Link to="#">
                                            <img src={friend.image} alt="avatar" className="w-32 h-30 object-cover rounded-md border-2 border-gray-200" />
                                        </Link>
                                        <Link to="#" className="font-medium text-[13px] hover:underline-offset-2 hover:underline">{friend.name}</Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/*Right Content*/}
                    <div className="w-[60%] space-y-4">
                        <CreateStatus />
                        {/*Posts*/}
                        {posts.length === 0 ? (
                            <h2 className="text-gray-500 text-center text-2xl">Bạn chưa có bài viết nào</h2>
                        ) : (
                            posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            )
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProfilePage;