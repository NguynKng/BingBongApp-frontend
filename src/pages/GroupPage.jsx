import { useEffect, useState } from "react";
import { groupAPI } from "../services/api"; // Đổi sang groupAPI
import GroupCard from "../components/GroupCard"; 
import { useNavigate } from "react-router-dom";
import CreateGroupModal from "../components/CreateGroupModal";
import { Plus, Search } from "lucide-react";
import SpinnerLoading from "../components/SpinnerLoading";

export default function GroupPage() {
    const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [joinedGroups, setJoinedGroups] = useState([]);

  const [filtered, setFiltered] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [all, mine, joined] = await Promise.all([
          groupAPI.getAllGroups(),
          groupAPI.getMyGroups(),
          groupAPI.getJoinedGroups(),
        ]);

        setGroups(all.data);
        setMyGroups(mine.data);
        setJoinedGroups(joined.data);

        setFiltered(all.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (activeTab === "all") setFiltered(groups);
    else if (activeTab === "my") setFiltered(myGroups);
    else setFiltered(joinedGroups);
  }, [activeTab, groups, myGroups, joinedGroups]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    const source =
      activeTab === "all"
        ? groups
        : activeTab === "my"
        ? myGroups
        : joinedGroups;

    if (!value.trim()) return setFiltered(source);

    const lower = value.toLowerCase();
    setFiltered(
      source.filter(
        (g) =>
          g.name.toLowerCase().includes(lower) ||
          g.description?.toLowerCase().includes(lower)
      )
    );
  };

  const handleGroupCreated = (newGroup) => {
    setMyGroups((prev) => [...prev, newGroup]);
    if (activeTab === "my") setFiltered((prev) => [...prev, newGroup]);
    navigate(`/group/${newGroup.slug}`);
  };

  return (
    <div className="flex flex-col gap-6 px-2 lg:px-8 lg:w-[90%] mx-auto py-6">
      {/* Header */}
      <div className="bg-white dark:bg-[#1e1e2f] border border-gray-200 dark:border-[#2b2b3d] rounded-lg p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: "all", label: "All Groups" },
            { key: "my", label: "My Groups" },
            { key: "joined", label: "Joined Groups" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-1.5 rounded-md cursor-pointer font-medium ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-[#2b2b3d] text-gray-700 dark:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full bg-gray-50 dark:bg-[#2b2b3d] border border-gray-300 dark:border-gray-600 rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          />
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
        >
          <Plus className="size-4" /> Create Group
        </button>
      </div>

      {/* List */}
      <div>
        {loading ? (
          <SpinnerLoading />
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No groups found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((group) => (
              <GroupCard key={group._id} group={group} />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <CreateGroupModal
          onClose={() => setShowModal(false)}
          onCreated={handleGroupCreated}
        />
      )}
    </div>
  );
}
