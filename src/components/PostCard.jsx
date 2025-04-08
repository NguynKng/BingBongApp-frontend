import PropTypes from 'prop-types';
import { Heart, MessageCircle } from "lucide-react"; 
import EmotionBar from './EmotionBar';

function PostCard({ post }) {
    const { likes, comments, avatar, author, time, content, image } = post;

    return (
        <div className="bg-white p-5 rounded-lg shadow-md mb-4">  {/* Đổi nền màu trắng */}
            <div className="flex items-center space-x-2 mb-3">
                <img
                    src={avatar}
                    alt={author}
                    className="w-10 h-10 rounded-full border-2 border-indigo-500"
                />
                <div>
                    <h3 className="text-black font-semibold">{author}</h3>  {/* Đổi màu chữ thành đen */}
                    <div className="flex items-center gap-1 text-gray-500 text-sm"> 
                        <span>{time}</span>
                        <span className="text-gray-400">•</span>
                        <img src="/globe.png" className="size-4 object-cover" />
                    </div>
                </div>
            </div>

            <p className="text-gray-800 mb-3">{content}</p>  {/* Đổi màu chữ thành xám đậm */}

            {image && <img src={image} alt="Post" className="rounded-lg w-full mb-3" />}

            <div className="flex items-center justify-between">
                <button className="flex items-center text-gray-600 hover:text-red-400 transition cursor-pointer relative group">
                    <Heart className="w-5 h-5 mr-1" /> {likes} Thích
                    <div className="absolute bottom-[120%] left-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-300 z-50">
                        <EmotionBar />
                    </div>
                </button>
                <button className="flex items-center text-gray-600 cursor-pointer hover:text-blue-400 transition">
                    <MessageCircle className="w-5 h-5 mr-1" /> {comments} Bình luận
                </button>
            </div>
        </div>
    );
}

PostCard.propTypes = {
    post: PropTypes.object.isRequired
};

export default PostCard;
