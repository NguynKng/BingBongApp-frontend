function CreateStatus(){
    return(
        <div className="px-4 bg-white rounded-lg">
            <div className="flex items-center gap-2 py-4 border-b-2 border-gray-200">
                <img src="/user.png" alt="user-avatar" className="object-cover rounded-full size-9 border-2 border-gray-300 cursor-pointer hover:opacity-[110%]" />
                <div className="py-2 px-4 rounded-full bg-gray-100 w-full hover:bg-gray-200 cursor-pointer">
                    <span className="text-gray-500 text-[1.1rem]">{`What's on your mind, Khang?`}</span>
                </div>
            </div>
            <div className="flex items-center py-2">
                <div className="flex items-center justify-center w-1/3 gap-2 hover:bg-gray-100 cursor-pointer rounded-md py-2 px-4">
                    <img src="/video-player.png" className="object-cover size-8" alt="video-player" />
                    <span className="text-gray-600">Live video</span>
                </div>
                <div className="flex items-center justify-center w-1/3 gap-2 hover:bg-gray-100 cursor-pointer rounded-md py-2 px-4">
                    <img src="/photos.png" className="object-cover size-8" alt="video-player" />
                    <span className="text-gray-600">Photo/video</span>
                </div>
                <div className="flex items-center justify-center w-1/3 gap-2 hover:bg-gray-100 cursor-pointer rounded-md py-2 px-4">
                    <img src="/smiling-face.png" className="object-cover size-8" alt="video-player" />
                    <span className="text-gray-600">Feeling/activity</span>
                </div>
            </div>
        </div>
    )
}

export default CreateStatus