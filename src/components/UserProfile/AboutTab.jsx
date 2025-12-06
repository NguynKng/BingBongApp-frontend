import { memo, useMemo } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Globe,
  Briefcase,
  GraduationCap,
  Calendar,
  Heart,
  Lightbulb,
  Users,
  Share2,
} from "lucide-react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import { getBackendImgURL } from "../../utils/helper";

const AboutTab = memo(({ displayedUser }) => {
  // ✅ Memoize has data checks
  const hasBasicInfo = useMemo(
    () =>
      displayedUser.email ||
      displayedUser.phoneNumber ||
      displayedUser.address ||
      displayedUser.website,
    [
      displayedUser.email,
      displayedUser.phoneNumber,
      displayedUser.address,
      displayedUser.website,
    ]
  );

  const hasEducation = useMemo(
    () =>
      displayedUser.education?.school ||
      displayedUser.education?.major ||
      displayedUser.education?.year,
    [displayedUser.education]
  );

  const hasWork = useMemo(
    () =>
      displayedUser.work?.company ||
      displayedUser.work?.position ||
      displayedUser.work?.duration,
    [displayedUser.work]
  );

  const hasSocialLinks = useMemo(
    () => displayedUser.socialLinks?.length > 0,
    [displayedUser.socialLinks]
  );

  const hasSkills = useMemo(
    () => displayedUser.skills?.length > 0,
    [displayedUser.skills]
  );

  const hasInterests = useMemo(
    () => displayedUser.interests?.length > 0,
    [displayedUser.interests]
  );

  const hasFriends = useMemo(
    () => displayedUser.friends?.length > 0,
    [displayedUser.friends]
  );

  return (
    <div className="space-y-4">
      {/* Bio Section */}
      {displayedUser.bio && (
        <InfoCard title="Bio" icon={Heart}>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {displayedUser.bio}
          </p>
        </InfoCard>
      )}

      {/* Basic Information */}
      {hasBasicInfo && (
        <InfoCard title="Contact Information" icon={Mail}>
          <div className="space-y-3">
            {displayedUser.email && (
              <InfoRow icon={Mail} label="Email" value={displayedUser.email} />
            )}
            {displayedUser.phoneNumber && (
              <InfoRow
                icon={Phone}
                label="Phone"
                value={displayedUser.phoneNumber}
              />
            )}
            {displayedUser.address && (
              <InfoRow
                icon={MapPin}
                label="Address"
                value={displayedUser.address}
              />
            )}
            {displayedUser.website && (
              <InfoRow
                icon={Globe}
                label="Website"
                value={displayedUser.website}
                isLink
              />
            )}
          </div>
        </InfoCard>
      )}

      {/* Education */}
      {hasEducation && (
        <InfoCard title="Education" icon={GraduationCap}>
          <div className="space-y-2">
            {displayedUser.education.school && (
              <div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {displayedUser.education.school}
                </span>
              </div>
            )}
            {displayedUser.education.major && (
              <div className="text-gray-600 dark:text-gray-400">
                Major: {displayedUser.education.major}
              </div>
            )}
            {displayedUser.education.year && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                {displayedUser.education.year}
              </div>
            )}
          </div>
        </InfoCard>
      )}

      {/* Work Experience */}
      {hasWork && (
        <InfoCard title="Work Experience" icon={Briefcase}>
          <div className="space-y-2">
            {displayedUser.work.position && (
              <div className="font-semibold text-gray-900 dark:text-white">
                {displayedUser.work.position}
              </div>
            )}
            {displayedUser.work.company && (
              <div className="text-gray-600 dark:text-gray-400">
                at {displayedUser.work.company}
              </div>
            )}
            {displayedUser.work.duration && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 text-sm">
                <Calendar className="w-4 h-4" />
                {displayedUser.work.duration}
              </div>
            )}
          </div>
        </InfoCard>
      )}

      {/* Skills */}
      {hasSkills && (
        <InfoCard title="Skills" icon={Lightbulb}>
          <div className="flex flex-wrap gap-2">
            {displayedUser.skills.map((skill, index) => (
              <SkillBadge key={index} skill={skill} />
            ))}
          </div>
        </InfoCard>
      )}

      {/* Interests */}
      {hasInterests && (
        <InfoCard title="Interests" icon={Heart}>
          <div className="flex flex-wrap gap-2">
            {displayedUser.interests.map((interest, index) => (
              <InterestBadge key={index} interest={interest} />
            ))}
          </div>
        </InfoCard>
      )}

      {/* Social Links */}
      {hasSocialLinks && (
        <InfoCard title="Social Links" icon={Share2}>
          <div className="space-y-3">
            {displayedUser.socialLinks.map((social, index) => (
              <SocialLink key={index} social={social} />
            ))}
          </div>
        </InfoCard>
      )}

      {/* Friends List */}
      {hasFriends && (
        <InfoCard title="Friends" icon={Users}>
          <div className="mb-4">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {displayedUser.friends.length}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                friends
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {displayedUser.friends.slice(0, 8).map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
          {displayedUser.friends.length > 8 && (
            <div className="mt-4 text-center">
              <Link
                to={`/profile/${displayedUser.slug}/friends`}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                View all {displayedUser.friends.length} friends
              </Link>
            </div>
          )}
        </InfoCard>
      )}

      {/* Empty State */}
      {!displayedUser.bio &&
        !hasBasicInfo &&
        !hasEducation &&
        !hasWork &&
        !hasSkills &&
        !hasInterests &&
        !hasSocialLinks &&
        !hasFriends && <EmptyState />}
    </div>
  );
});

AboutTab.displayName = "AboutTab";

AboutTab.propTypes = {
  displayedUser: propTypes.shape({
    email: propTypes.string,
    phoneNumber: propTypes.string,
    address: propTypes.string,
    website: propTypes.string,
    bio: propTypes.string,
    slug: propTypes.string,
    education: propTypes.shape({
      school: propTypes.string,
      major: propTypes.string,
      year: propTypes.string,
    }),
    work: propTypes.shape({
      company: propTypes.string,
      position: propTypes.string,
      duration: propTypes.string,
    }),
    socialLinks: propTypes.arrayOf(
      propTypes.shape({
        platform: propTypes.string,
        url: propTypes.string,
      })
    ),
    skills: propTypes.arrayOf(propTypes.string),
    interests: propTypes.arrayOf(propTypes.string),
    friends: propTypes.arrayOf(
      propTypes.shape({
        _id: propTypes.string.isRequired,
        fullName: propTypes.string.isRequired,
        slug: propTypes.string.isRequired,
        avatar: propTypes.string,
      })
    ),
  }).isRequired,
};

// ✅ InfoCard Component
const InfoCard = memo(({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-[#1b1f2b] rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </h2>
    </div>
    {children}
  </div>
));

InfoCard.displayName = "InfoCard";

InfoCard.propTypes = {
  title: propTypes.string.isRequired,
  icon: propTypes.elementType.isRequired,
  children: propTypes.node.isRequired,
};

// ✅ InfoRow Component
const InfoRow = memo(({ icon: Icon, label, value, isLink = false }) => (
  <div className="flex items-start gap-3">
    <Icon className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      {isLink ? (
        <a
          href={value.startsWith("http") ? value : `https://${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline break-all"
        >
          {value}
        </a>
      ) : (
        <div className="text-gray-900 dark:text-white break-all">{value}</div>
      )}
    </div>
  </div>
));

InfoRow.displayName = "InfoRow";

InfoRow.propTypes = {
  icon: propTypes.elementType.isRequired,
  label: propTypes.string.isRequired,
  value: propTypes.string.isRequired,
  isLink: propTypes.bool,
};

// ✅ SkillBadge Component
const SkillBadge = memo(({ skill }) => (
  <span className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium border border-blue-100 dark:border-blue-800">
    {skill}
  </span>
));

SkillBadge.displayName = "SkillBadge";

SkillBadge.propTypes = {
  skill: propTypes.string.isRequired,
};

// ✅ InterestBadge Component
const InterestBadge = memo(({ interest }) => (
  <span className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium border border-purple-100 dark:border-purple-800">
    {interest}
  </span>
));

InterestBadge.displayName = "InterestBadge";

InterestBadge.propTypes = {
  interest: propTypes.string.isRequired,
};

// ✅ SocialLink Component
const SocialLink = memo(({ social }) => (
  <a
    href={social.url.startsWith("http") ? social.url : `https://${social.url}`}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a3142] transition-colors group"
  >
    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/20 transition-colors">
      <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
    </div>
    <div className="flex-1">
      <div className="font-medium text-gray-900 dark:text-white">
        {social.platform}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
        {social.url}
      </div>
    </div>
  </a>
));

SocialLink.displayName = "SocialLink";

SocialLink.propTypes = {
  social: propTypes.shape({
    platform: propTypes.string.isRequired,
    url: propTypes.string.isRequired,
  }).isRequired,
};

// ✅ NEW: FriendCard Component
const FriendCard = memo(({ friend }) => (
  <Link
    to={`/profile/${friend.slug}`}
    className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a3142] transition-all group"
  >
    <div className="relative mb-2">
      <img
        src={getBackendImgURL(friend.avatar)}
        alt={friend.fullName}
        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors"
        loading="lazy"
      />
    </div>
    <h3 className="text-sm font-medium text-gray-900 dark:text-white text-center truncate w-full group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
      {friend.fullName}
    </h3>
    <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-full text-center">
      @{friend.slug}
    </p>
  </Link>
));

FriendCard.displayName = "FriendCard";

FriendCard.propTypes = {
  friend: propTypes.shape({
    _id: propTypes.string.isRequired,
    fullName: propTypes.string.isRequired,
    slug: propTypes.string.isRequired,
    avatar: propTypes.string,
  }).isRequired,
};

// ✅ EmptyState Component
const EmptyState = memo(() => (
  <div className="bg-white dark:bg-[#1b1f2b] rounded-lg shadow-md p-12 text-center border border-gray-100 dark:border-gray-700">
    <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
      No information yet
    </h3>
    <p className="text-gray-500 dark:text-gray-400">
      {`This user hasn't added any information to their profile yet.`}
    </p>
  </div>
));

EmptyState.displayName = "EmptyState";

export default AboutTab;