import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  Facebook,
  Instagram,
  Youtube,
  Map,
} from "lucide-react";

export default function AboutTab({ shop }) {
  const {
    description = {},
    openTime = "08:00",
    closeTime = "21:00",
    socials = {},
    mapURL,
  } = shop || {};

  // 🕒 Determine current open status
  const now = new Date();
  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);
  const isOpen =
    now.getHours() > openH && now.getHours() < closeH
      ? true
      : now.getHours() === openH
      ? now.getMinutes() >= openM
      : now.getHours() === closeH
      ? now.getMinutes() <= closeM
      : false;

  return (
    <div className="bg-white dark:bg-[#1e1e2f] rounded-xl shadow-sm p-6 space-y-8">
      {/* 🏪 About Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-gray-100">
          About
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {description.about || "No description available for this shop."}
        </p>
      </section>

      {/* 📍 Contact Info + Opening Hours */}
      <section className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Contact Information
          </h3>

          {description.address && (
            <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <MapPin className="fill-gray-500 text-white dark:text-black" />{" "}
              {description.address}
            </p>
          )}
          {description.phone && (
            <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Phone className="fill-gray-500 text-white dark:text-black" />
              <a href={`tel:${description.phone}`} className="hover:underline">
                {description.phone}
              </a>
            </p>
          )}
          {description.email && (
            <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Mail className="fill-gray-500 text-white dark:text-black" />
              <a href={`mailto:${description.email}`} className="hover:underline">
                {description.email}
              </a>
            </p>
          )}
          {description.website && (
            <p className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Globe className="fill-gray-500 text-white dark:text-black" />
              <a
                href={description.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline text-blue-600 dark:text-blue-400"
              >
                {description.website}
              </a>
            </p>
          )}
        </div>

        {/* Opening Hours */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Opening Hours
          </h3>
          <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
            <Clock className="fill-gray-500 text-white dark:text-black" />
            <span>
              {openTime} - {closeTime}
            </span>
          </div>
          <span
            className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
              isOpen
                ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
            }`}
          >
            {isOpen ? "Open Now" : "Closed"}
          </span>
        </div>
      </section>

      {/* 🌐 Social Media */}
      {(socials.facebook ||
        socials.instagram ||
        socials.tiktok ||
        socials.youtube) && (
        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Social Media
          </h3>
          <div className="flex flex-wrap items-center gap-5">
            {socials.facebook && (
              <a
                href={socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <Facebook size={22} />
                <span>Facebook</span>
              </a>
            )}
            {socials.instagram && (
              <a
                href={socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-500 hover:text-pink-600"
              >
                <Instagram size={22} />
                <span>Instagram</span>
              </a>
            )}
            {socials.youtube && (
              <a
                href={socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-500 hover:text-red-600"
              >
                <Youtube size={22} />
                <span>YouTube</span>
              </a>
            )}
          </div>
        </section>
      )}

      {/* 🗺️ Google Map */}
      {mapURL && (
        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Map
          </h3>
          <div className="rounded-xl overflow-hidden shadow-md border border-gray-100 dark:border-gray-700">
            <iframe
              src={mapURL}
              width="100%"
              height="500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="w-full rounded-lg"
            ></iframe>
          </div>
        </section>
      )}
    </div>
  );
}
