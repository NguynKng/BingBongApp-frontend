import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import useGameStore from "../store/gameStore";
import {
  Gamepad2,
  Star,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  TrendingUp,
  CalendarClock,
  Trophy,
  Users,
  Flame,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const PLATFORM_ICONS = {
  pc: "🖥️",
  playstation: "🎮",
  xbox: "🕹️",
  nintendo: "🔴",
  ios: "📱",
  android: "📱",
  mac: "🍎",
  linux: "🐧",
};

function getPlatformIcons(platforms) {
  if (!platforms || !Array.isArray(platforms) || platforms.length === 0) return ["🎮"];
  const slugs = platforms.map((p) => p.platform?.slug || "");
  const found = Object.entries(PLATFORM_ICONS)
    .filter(([key]) => slugs.some((s) => s.includes(key)))
    .map(([, icon]) => icon);
  return [...new Set(found)].slice(0, 3);
}

function metacriticColor(score) {
  if (!score) return "";
  if (score >= 75) return "bg-green-500 text-white";
  if (score >= 50) return "bg-yellow-400 text-black";
  return "bg-red-500 text-white";
}

function formatDate(dateStr) {
  if (!dateStr) return "TBA";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Game Card (grid) ────────────────────────────────────────────────────────

function GameCard({ game, rank }) {
  const rating = game.rating?.toFixed(1) || "—";
  const icons = getPlatformIcons(game.platforms);

  return (
    <Link
      to={`/games/${game.id}`}
      className="group relative bg-white dark:bg-gray-800/60 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/40 hover:border-violet-400 dark:hover:border-violet-500 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={game.background_image || "https://placehold.co/400x225/1a1a2e/7c3aed?text=No+Image"}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Rank badge */}
        {rank !== undefined && (
          <div className="absolute top-2 left-2 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center text-white text-[10px] font-black">
            {rank}
          </div>
        )}

        {/* Metacritic */}
        {game.metacritic && (
          <div className="absolute top-2 right-2">
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-black ${metacriticColor(game.metacritic)}`}>
              {game.metacritic}
            </span>
          </div>
        )}

        {/* Platform icons */}
        <div className="absolute bottom-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {icons.map((ic, i) => (
            <span key={i} className="text-xs bg-black/60 backdrop-blur-sm rounded px-1">{ic}</span>
          ))}
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {game.name}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1">
            <Star size={11} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{rating}</span>
          </div>
          <span className="text-[10px] text-gray-400">
            {game.released ? new Date(game.released).getFullYear() : "TBA"}
          </span>
        </div>
        {game.genres && game.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {game.genres.slice(0, 2).map((g) => (
              <span key={g.id} className="px-1.5 py-0.5 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded text-[10px] font-medium">
                {g.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

// ─── Horizontal Scroll Section ───────────────────────────────────────────────

function HScrollSection({ title, icon, games, loading, accentColor = "violet", showRank = false, viewAllHref }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  const accent = {
    violet: { label: "text-violet-500", track: "from-violet-600" },
    blue: { label: "text-blue-500", track: "from-blue-600" },
    amber: { label: "text-amber-500", track: "from-amber-500" },
    emerald: { label: "text-emerald-500", track: "from-emerald-600" },
  }[accentColor] || { label: "text-violet-500", track: "from-violet-600" };

  if (!loading && games.length === 0) return null;

  return (
    <section className="mb-12">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 ${accent.label}`}>
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">{title}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {viewAllHref && (
            <Link to={viewAllHref} className={`hidden sm:flex items-center gap-1 text-sm font-semibold ${accent.label} hover:underline`}>
              View all <ArrowRight size={14} />
            </Link>
          )}
          <button onClick={() => scroll(-1)} className="p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer text-gray-600 dark:text-gray-300">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll(1)} className="p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer text-gray-600 dark:text-gray-300">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Scroll track */}
      <div ref={ref} className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide scroll-smooth -mx-1 px-1">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-52 rounded-2xl overflow-hidden animate-pulse bg-gray-200 dark:bg-gray-800">
                <div className="aspect-video bg-gray-300 dark:bg-gray-700" />
                <div className="p-3 space-y-2">
                  <div className="h-3.5 bg-gray-300 dark:bg-gray-600 rounded" />
                  <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                </div>
              </div>
            ))
          : games.map((game, i) => (
              <div key={game.id} className="flex-shrink-0 w-52">
                <GameCard game={game} rank={showRank ? i + 1 : undefined} />
              </div>
            ))}
      </div>
    </section>
  );
}

// ─── Upcoming Card (special layout) ─────────────────────────────────────────

function UpcomingCard({ game }) {
  const days = game.released
    ? Math.ceil((new Date(game.released) - Date.now()) / 864e5)
    : null;

  return (
    <Link
      to={`/games/${game.id}`}
      className="group flex-shrink-0 w-72 bg-white dark:bg-gray-800/60 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700/40 hover:border-violet-400 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-0.5"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={game.background_image || "https://placehold.co/288x162/1a1a2e/7c3aed?text=Coming+Soon"}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Days badge */}
        {days !== null && (
          <div className={`absolute top-2 right-2 px-2.5 py-1 rounded-xl text-xs font-black backdrop-blur-sm ${
            days <= 7 ? "bg-red-500 text-white" :
            days <= 30 ? "bg-orange-500 text-white" :
            "bg-violet-600/80 text-white"
          }`}>
            {days === 0 ? "Today!" : days < 0 ? "Out now" : `${days}d`}
          </div>
        )}

        {/* Release date overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="flex items-center gap-2 text-white">
            <CalendarClock size={13} className="text-violet-300 flex-shrink-0" />
            <span className="text-xs font-semibold">{formatDate(game.released)}</span>
          </div>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1 group-hover:text-violet-500 transition-colors">
          {game.name}
        </h3>
        <div className="flex flex-wrap gap-1 mt-2">
          {game.genres?.slice(0, 3).map((g) => (
            <span key={g.id} className="px-1.5 py-0.5 bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded text-[10px] font-medium">
              {g.name}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-2">
          {getPlatformIcons(game.platforms).map((ic, i) => (
            <span key={i} className="text-sm">{ic}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}

// ─── Upcoming Section ────────────────────────────────────────────────────────

function UpcomingSection({ games, loading }) {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 310, behavior: "smooth" });

  if (!loading && games.length === 0) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-900/20 text-orange-500">
            <CalendarClock size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">Coming Soon</h2>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Upcoming releases</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer text-gray-600 dark:text-gray-300">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll(1)} className="p-2 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all cursor-pointer text-gray-600 dark:text-gray-300">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div ref={ref} className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72 rounded-2xl overflow-hidden animate-pulse bg-gray-200 dark:bg-gray-800">
                <div className="aspect-video bg-gray-300 dark:bg-gray-700" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              </div>
            ))
          : games.map((game) => <UpcomingCard key={game.id} game={game} />)}
      </div>
    </section>
  );
}

// ─── Hero Slider ─────────────────────────────────────────────────────────────

function HeroSlider({ games }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!games.length) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % games.length), 7000);
    return () => clearInterval(t);
  }, [games.length]);

  const game = games[current];
  if (!game) return null;

  return (
    <div className="relative h-[68vh] overflow-hidden rounded-3xl mb-12 shadow-2xl">
      {/* Background */}
      <img
        src={game.background_image || "https://placehold.co/1400x600/1a1a2e/7c3aed?text=Game"}
        alt={game.name}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-700"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-center px-8 md:px-16">
        <div className="max-w-xl space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-violet-600 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Flame size={11} /> Trending
            </span>
            {game.metacritic && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${metacriticColor(game.metacritic)}`}>
                Metacritic {game.metacritic}
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
            {game.name}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Star size={14} className="fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-white">{game.rating?.toFixed(1)}</span>
              <span className="text-gray-400">/ 5</span>
            </div>
            {game.released && (
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg text-gray-200 text-xs">
                {formatDate(game.released)}
              </div>
            )}
            {game.genres?.slice(0, 3).map((g) => (
              <span key={g.id} className="px-2.5 py-1 bg-white/10 backdrop-blur-sm text-white rounded-lg text-xs">
                {g.name}
              </span>
            ))}
          </div>

          {/* Playtime & players */}
          {(game.playtime > 0 || game.added > 0) && (
            <div className="flex gap-3 text-xs text-gray-400">
              {game.playtime > 0 && (
                <span className="flex items-center gap-1">⏱ {game.playtime}h avg</span>
              )}
              {game.added > 0 && (
                <span className="flex items-center gap-1">
                  <Users size={11} /> {game.added?.toLocaleString()} players
                </span>
              )}
            </div>
          )}

          {/* CTA */}
          <div className="flex gap-3 pt-1">
            <Link
              to={`/games/${game.id}`}
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 px-7 rounded-xl transition-all hover:scale-105 shadow-lg shadow-violet-500/30"
            >
              <Gamepad2 size={17} /> View Details
            </Link>
            <Link
              to="/games/search"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-xl transition-all border border-white/20 hover:border-white/40"
            >
              <Search size={15} /> Search
            </Link>
          </div>
        </div>
      </div>

      {/* Platform icons – top right */}
      <div className="absolute top-5 right-5 flex gap-2">
        {getPlatformIcons(game.platforms).map((ic, i) => (
          <span key={i} className="text-lg bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">{ic}</span>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {games.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all cursor-pointer ${
              i === current ? "w-8 bg-violet-400" : "w-1.5 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent((p) => (p - 1 + games.length) % games.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full text-white cursor-pointer transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => setCurrent((p) => (p + 1) % games.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 backdrop-blur-sm p-3 rounded-full text-white cursor-pointer transition-all"
      >
        <ChevronRight size={20} />
      </button>

      {/* Index counter */}
      <div className="absolute bottom-6 right-6 text-white/50 text-xs font-mono">
        {String(current + 1).padStart(2, "0")} / {String(games.length).padStart(2, "0")}
      </div>
    </div>
  );
}

// ─── Genre Pills ─────────────────────────────────────────────────────────────

function GenreFilter({ genres, selected, onSelect }) {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-violet-500">
          <Filter size={16} />
        </div>
        <h2 className="text-base font-black text-gray-900 dark:text-white">Browse by Genre</h2>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button
          id="genre-all"
          onClick={() => onSelect(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
            selected === null
              ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 border border-gray-100 dark:border-gray-700"
          }`}
        >
          All
        </button>
        {genres.map((g) => (
          <button
            key={g.id}
            id={`genre-${g.slug}`}
            onClick={() => onSelect(g.slug)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-all whitespace-nowrap ${
              selected === g.slug
                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 border border-gray-100 dark:border-gray-700"
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>
    </section>
  );
}

// ─── Browse Grid ─────────────────────────────────────────────────────────────

const GAME_ORDERINGS = [
  { label: "Rating ↓", value: "-rating" },
  { label: "Metacritic ↓", value: "-metacritic" },
  { label: "Released ↓", value: "-released" },
  { label: "Released ↑", value: "released" },
  { label: "Most Added", value: "-added" },
  { label: "Name A→Z", value: "name" },
];

function BrowseSection({ games, loading, totalCount, onLoadMore, ordering, onOrderChange, selectedGenre, genres }) {
  const hasMore = games.length < totalCount;
  const selectedName = genres.find((g) => g.slug === selectedGenre)?.name || "All Games";

  return (
    <section className="pt-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-violet-500">
            <SlidersHorizontal size={16} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">{selectedName}</h2>
            {totalCount > 0 && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                {totalCount.toLocaleString()} games found
              </p>
            )}
          </div>
        </div>
        <select
          id="game-sort"
          value={ordering}
          onChange={(e) => onOrderChange(e.target.value)}
          className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
        >
          {GAME_ORDERINGS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading && games.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden animate-pulse">
              <div className="aspect-video bg-gray-300 dark:bg-gray-700" />
              <div className="p-3 space-y-2">
                <div className="h-3.5 bg-gray-300 dark:bg-gray-700 rounded" />
                <div className="h-2.5 bg-gray-200 dark:bg-gray-600 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-10">
              <button
                id="load-more-games"
                onClick={onLoadMore}
                disabled={loading}
                className="px-8 py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-violet-500/20 cursor-pointer flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  `Load More  (${games.length} / ${totalCount})`
                )}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

export default function GamePage() {
  const {
    trending, upcoming, popular, bestRated, genres,
    games, totalCount, sectionLoading,
    fetchTrendingGames, fetchUpcomingGames, fetchPopularGames,
    fetchBestRatedGames, fetchGenres, fetchGames, clearGames,
  } = useGameStore();

  const [selectedGenre, setSelectedGenre] = useState(null);
  const [ordering, setOrdering] = useState("-rating");
  const [page, setPage] = useState(1);

  // Fetch all sections on mount
  useEffect(() => {
    fetchTrendingGames();
    fetchUpcomingGames();
    fetchPopularGames();
    fetchBestRatedGames();
    fetchGenres();
  }, [fetchTrendingGames, fetchUpcomingGames, fetchPopularGames, fetchBestRatedGames, fetchGenres]);

  // Browse list – refetch when filter/sort changes
  const doFetch = useCallback(
    (p, append) => {
      const params = { page: p, page_size: PAGE_SIZE, ordering };
      if (selectedGenre) params.genres = selectedGenre;
      fetchGames(params, append);
    },
    [selectedGenre, ordering, fetchGames]
  );

  useEffect(() => {
    clearGames();
    setPage(1);
    doFetch(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre, ordering]);

  const handleLoadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    doFetch(next, true);
  }, [page, doFetch]);

  const handleGenreSelect = useCallback((slug) => {
    setSelectedGenre(slug);
  }, []);

  const handleOrderChange = useCallback((val) => {
    setOrdering(val);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0d0d1a] text-gray-900 dark:text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/80 dark:bg-[#0d0d1a]/90 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/30 rounded-xl">
              <Gamepad2 className="text-violet-600 dark:text-violet-400" size={20} />
            </div>
            <div>
              <p className="font-black text-base text-gray-900 dark:text-white leading-none">GameHub</p>
              <p className="text-[10px] text-gray-400">Powered by RAWG.io</p>
            </div>
          </div>
          <Link
            to="/games/search"
            id="game-search-btn"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-xl text-sm text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-all border border-transparent hover:border-violet-200 dark:hover:border-violet-700"
          >
            <Search size={15} />
            <span className="hidden sm:inline">Search games…</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* ① Hero – Trending */}
        {(sectionLoading.trending || trending.length > 0) && (
          sectionLoading.trending && trending.length === 0 ? (
            <div className="h-[68vh] bg-gray-200 dark:bg-gray-800 rounded-3xl mb-12 animate-pulse" />
          ) : (
            <HeroSlider games={trending} />
          )
        )}

        {/* ② Coming Soon */}
        <UpcomingSection games={upcoming} loading={sectionLoading.upcoming} />

        {/* ③ Most Popular (most added by users) */}
        <HScrollSection
          title="Most Popular"
          icon={<Users size={18} />}
          games={popular}
          loading={sectionLoading.popular}
          accentColor="blue"
          showRank
        />

        {/* ④ Best Rated (Metacritic) */}
        <HScrollSection
          title="Critically Acclaimed"
          icon={<Trophy size={18} />}
          games={bestRated}
          loading={sectionLoading.bestRated}
          accentColor="amber"
          showRank
        />

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800/60 my-10" />

        {/* ⑤ Genre Filter */}
        <GenreFilter genres={genres} selected={selectedGenre} onSelect={handleGenreSelect} />

        {/* ⑥ Browse / All Games */}
        <BrowseSection
          games={games}
          loading={sectionLoading.games}
          totalCount={totalCount}
          onLoadMore={handleLoadMore}
          ordering={ordering}
          onOrderChange={handleOrderChange}
          selectedGenre={selectedGenre}
          genres={genres}
        />

      </div>
    </div>
  );
}
