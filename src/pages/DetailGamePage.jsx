import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { gameAPI } from "../services/api";
import {
  Star,
  Calendar,
  ChevronLeft,
  ExternalLink,
  Gamepad2,
  Trophy,
  Users,
  Clock,
  Globe,
  Twitter,
  Youtube,
  ChevronRight,
  X,
} from "lucide-react";

function MetaTag({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">{label}</span>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</span>
    </div>
  );
}

function PlatformBadge({ platform }) {
  return (
    <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-lg font-medium border border-gray-200 dark:border-gray-700">
      {platform.platform?.name || platform.name}
    </span>
  );
}

function ScreenshotModal({ screenshots, initial, onClose }) {
  const [idx, setIdx] = useState(initial);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setIdx((p) => Math.max(0, p - 1));
      if (e.key === "ArrowRight") setIdx((p) => Math.min(screenshots.length - 1, p + 1));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [screenshots.length, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors cursor-pointer"
      >
        <X size={28} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); setIdx((p) => Math.max(0, p - 1)); }}
        disabled={idx === 0}
        className="absolute left-4 text-white/70 hover:text-white disabled:opacity-30 transition-colors cursor-pointer bg-black/40 p-3 rounded-full"
      >
        <ChevronLeft size={24} />
      </button>
      <img
        src={screenshots[idx]?.image}
        alt="Screenshot"
        className="max-w-5xl max-h-[80vh] rounded-xl object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={(e) => { e.stopPropagation(); setIdx((p) => Math.min(screenshots.length - 1, p + 1)); }}
        disabled={idx === screenshots.length - 1}
        className="absolute right-4 text-white/70 hover:text-white disabled:opacity-30 transition-colors cursor-pointer bg-black/40 p-3 rounded-full"
      >
        <ChevronRight size={24} />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        {idx + 1} / {screenshots.length}
      </div>
    </div>
  );
}

function SimilarGameCard({ game }) {
  return (
    <Link
      to={`/games/${game.id}`}
      className="group flex-shrink-0 w-40 bg-white dark:bg-gray-800/60 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700/50 hover:border-violet-400 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={game.background_image || "https://placehold.co/160x90/1a1a2e/7c3aed?text=Game"}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-2">
        <p className="text-xs font-semibold text-gray-800 dark:text-white line-clamp-2 group-hover:text-violet-500 transition-colors">
          {game.name}
        </p>
        {game.rating > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <Star size={10} className="fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] text-gray-500 dark:text-gray-400">{game.rating?.toFixed(1)}</span>
          </div>
        )}
      </div>
    </Link>
  );
}

export default function DetailGamePage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [similarGames, setSimilarGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalIdx, setModalIdx] = useState(null);
  const seriesScrollRef = useRef(null);
  const scrollSeries = (dir) => seriesScrollRef.current?.scrollBy({ left: dir * 200, behavior: "smooth" });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setGame(null);
      try {
        const [detailRes, ssRes, simRes] = await Promise.allSettled([
          gameAPI.getGameDetail(id),
          gameAPI.getGameScreenshots(id),
          gameAPI.getSimilarGames(id),
        ]);
        if (detailRes.status === "fulfilled") setGame(detailRes.value.content);
        if (ssRes.status === "fulfilled") setScreenshots(ssRes.value.content || []);
        if (simRes.status === "fulfilled") setSimilarGames(simRes.value.content || []);
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d1a] animate-pulse">
        <div className="h-[55vh] bg-gray-200 dark:bg-gray-800" />
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-4">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-xl w-2/3" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d1a] flex flex-col items-center justify-center gap-4">
        <Gamepad2 size={64} className="text-gray-300 dark:text-gray-700" />
        <p className="text-xl text-gray-500 dark:text-gray-400">Game not found</p>
        <Link to="/games" className="px-6 py-3 bg-violet-600 text-white rounded-xl font-bold hover:bg-violet-700 transition-all">
          Back to Games
        </Link>
      </div>
    );
  }

  const ratingColor =
    game.metacritic >= 75 ? "text-green-500" :
    game.metacritic >= 50 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d1a] text-gray-900 dark:text-white">
      {/* Hero */}
      <div className="relative h-[55vh] overflow-hidden">
        <img
          src={game.background_image || "https://placehold.co/1400x600/1a1a2e/7c3aed?text=Game"}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#0d0d1a] via-black/40 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <Link
            to="/games"
            id="back-to-games"
            className="inline-flex items-center gap-2 bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-xl transition-all font-medium text-sm"
          >
            <ChevronLeft size={16} />
            Back to Games
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 -mt-20 relative z-10 pb-16">
        {/* Title Section */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            {game.genres?.map((g) => (
              <Link
                key={g.id}
                to={`/games?genre=${g.slug}`}
                className="px-3 py-1 bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-400 text-xs font-semibold rounded-full hover:bg-violet-200 dark:hover:bg-violet-900/60 transition-colors"
              >
                {g.name}
              </Link>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
            {game.name}
          </h1>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold">{game.rating?.toFixed(1)}</span>
              <span className="text-gray-400">/ 5</span>
              <span className="text-gray-400 text-xs">({game.ratings_count?.toLocaleString()} ratings)</span>
            </div>
            {game.metacritic && (
              <div className={`flex items-center gap-2 bg-white dark:bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm`}>
                <Trophy size={16} className={ratingColor} />
                <span className={`font-bold ${ratingColor}`}>{game.metacritic}</span>
                <span className="text-gray-400 text-xs">Metacritic</span>
              </div>
            )}
            {game.released && (
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <Calendar size={16} className="text-gray-400" />
                <span className="font-medium">{new Date(game.released).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
              </div>
            )}
            {game.playtime > 0 && (
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <Clock size={16} className="text-gray-400" />
                <span className="font-medium">{game.playtime}h avg playtime</span>
              </div>
            )}
            {game.added > 0 && (
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800/80 px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <Users size={16} className="text-gray-400" />
                <span className="font-medium">{game.added?.toLocaleString()} players added</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Description & Screenshots */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            {game.description_raw && (
              <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-violet-500 rounded-full inline-block" />
                  About
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-line line-clamp-10">
                  {game.description_raw}
                </p>
              </div>
            )}

            {/* Screenshots */}
            {screenshots.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-1 h-5 bg-violet-500 rounded-full inline-block" />
                  Screenshots
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {screenshots.map((ss, i) => (
                    <button
                      key={ss.id}
                      id={`screenshot-${i}`}
                      onClick={() => setModalIdx(i)}
                      className="aspect-video overflow-hidden rounded-xl cursor-pointer group hover:ring-2 hover:ring-violet-500 transition-all"
                    >
                      <img
                        src={ss.image}
                        alt={`Screenshot ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Games */}
            {similarGames.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-1 h-5 bg-violet-500 rounded-full inline-block" />
                    Game Series
                    <span className="text-sm font-normal text-gray-400 dark:text-gray-500">({similarGames.length})</span>
                  </h2>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => scrollSeries(-1)}
                      className="p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer text-gray-500 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <button
                      onClick={() => scrollSeries(1)}
                      className="p-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer text-gray-500 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
                <div ref={seriesScrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
                  {similarGames.map((g) => (
                    <SimilarGameCard key={g.id} game={g} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Info Panel */}
          <div className="space-y-4">
            {/* Platforms */}
            {game.platforms && game.platforms.length > 0 && (
              <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {game.platforms.map((p) => (
                    <PlatformBadge key={p.platform?.id} platform={p} />
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Details</h3>
              <MetaTag label="Developer" value={game.developers?.map((d) => d.name).join(", ")} />
              <MetaTag label="Publisher" value={game.publishers?.map((p) => p.name).join(", ")} />
              <MetaTag label="ESRB Rating" value={game.esrb_rating?.name} />
              <MetaTag label="Tags" value={game.tags?.slice(0, 5).map((t) => t.name).join(", ")} />
            </div>

            {/* External Links */}
            <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Links</h3>
              {game.website && (
                <a href={game.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  <Globe size={14} /> Official Website
                  <ExternalLink size={12} className="ml-auto" />
                </a>
              )}
              {game.reddit_url && (
                <a href={game.reddit_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors">
                  <span className="text-sm">👽</span> Reddit
                  <ExternalLink size={12} className="ml-auto" />
                </a>
              )}
              {game.clip?.clip && (
                <a href={game.clip.clip} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors">
                  <Youtube size={14} /> Clip
                  <ExternalLink size={12} className="ml-auto" />
                </a>
              )}
            </div>

            {/* Rating Breakdown */}
            {game.ratings && game.ratings.length > 0 && (
              <div className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm">
                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Player Ratings</h3>
                <div className="space-y-2">
                  {game.ratings.map((r) => (
                    <div key={r.id} className="flex items-center gap-2">
                      <span className="text-xs w-20 text-gray-600 dark:text-gray-400 capitalize">{r.title}</span>
                      <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-violet-500 transition-all"
                          style={{ width: `${r.percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">{r.percent?.toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Screenshot Modal */}
      {modalIdx !== null && screenshots.length > 0 && (
        <ScreenshotModal
          screenshots={screenshots}
          initial={modalIdx}
          onClose={() => setModalIdx(null)}
        />
      )}
    </div>
  );
}
