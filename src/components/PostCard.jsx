import PropTypes from 'prop-types';
import { Heart, MessageCircle } from "lucide-react"; 

function PostCard({ post }) {
    const { likes, comments, avatar, author, time, content, image } = post;

    return (
        <div className="bg-white p-5 rounded-lg shadow-md mb-4">  {/* Đổi nền màu trắng */}
            <div className="flex items-center space-x-4 mb-3">
                <img
                    src={avatar}
                    alt={author}
                    className="w-10 h-10 rounded-full border-2 border-indigo-500"
                />
                <div>
                    <h3 className="text-black font-semibold">{author}</h3>  {/* Đổi màu chữ thành đen */}
                    <p className="text-gray-600 text-sm">{time}</p>  {/* Đổi màu chữ thành xám */}
                </div>
            </div>

            <p className="text-gray-800 mb-3">{content}</p>  {/* Đổi màu chữ thành xám đậm */}

            {image && <img src={image} alt="Post" className="rounded-lg w-full mb-3" />}

            <div className="flex items-center justify-between">
                <button className="flex items-center text-gray-600 hover:text-red-400 transition">
                    <Heart className="w-5 h-5 mr-1" /> {likes} Thích
                </button>
                <div className="flex items-center text-gray-600">
                    <MessageCircle className="w-5 h-5 mr-1" /> {comments} Bình luận
                </div>
            </div>
        </div>
    );
}

PostCard.propTypes = {
    post: PropTypes.object.isRequired
};

export default PostCard;
