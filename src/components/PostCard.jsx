import PropTypes from 'prop-types';
import { Heart, MessageCircle } from "lucide-react"; 
import EmotionBar from './EmotionBar';
import Config from '../envVars';
import { formatTime } from '../utils/timeUtils';
function PostCard({ post }) {
    const {
        likes,
        comments,
        createdAt,
        content,
        media,
        author, // author là object
    } = post;

    return (
        <div className="bg-white p-5 rounded-lg shadow-md mb-4">
            <div className="flex items-center space-x-2 mb-3">
                <img
                    src={author?.avatar ? `${Config.BACKEND_URL}${author.avatar}` : "/user-none.webp"}
                    alt={author?.fullName}
                    className="w-10 h-10 rounded-full border-2 border-indigo-500"
                />
                <div>
                    <h3 className="text-black font-semibold">{author?.fullName}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm"> 
                        <span>{formatTime(createdAt)}</span>
                        <span className="text-gray-400">•</span>
                        <img src="/globe.png" className="size-4 object-cover" />
                    </div>
                </div>
            </div>

            <p className="text-gray-800 mb-3">{content}</p>

            {media && media.length > 0 && (
                <div className="flex flex-wrap gap-2 my-3">
                  {media.slice(0, 4).map((img, index) => (
                    <div
                      key={index}
                      className="relative"
                      style={{
                        flex: media.length === 1 ? "1 1 100%" : "1 1 calc(50% - 0.5rem)",
                        minHeight: "240px",
                      }}
                    >
                      <img
                        src={`${Config.BACKEND_URL}${img}`}
                        alt={`post-img-${index}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
              
                      {/* If more than 4 images, show a "+n" on the last visible one */}
                      {index === 3 && media.length > 4 && (
                        <div className="absolute inset-0 bg-black/50 text-white text-2xl font-bold flex items-center justify-center rounded-lg">
                          +{media.length - 4}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            <div className="flex items-center justify-between">
                <button className="flex items-center text-gray-600 hover:text-red-400 transition cursor-pointer relative group">
                    <Heart className="w-5 h-5 mr-1" /> 5 Thích
                    <div className="absolute bottom-[120%] left-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all delay-300 z-30">
                        <EmotionBar />
                    </div>
                </button>
                <button className="flex items-center text-gray-600 cursor-pointer hover:text-blue-400 transition">
                    <MessageCircle className="w-5 h-5 mr-1" /> 5 Bình luận
                </button>
            </div>
        </div>
    );
}

PostCard.propTypes = {
    post: PropTypes.shape({
        likes: PropTypes.number,
        comments: PropTypes.array,
        createdAt: PropTypes.string,
        content: PropTypes.string,
        media: PropTypes.array,
        author: PropTypes.shape({
            fullName: PropTypes.string,
            avatar: PropTypes.string,
        })
    }).isRequired
};

export default PostCard;
