import PropTypes from "prop-types";

export default function WarningDeleteFriend({
  onConfirm,
  onCancel,
  displayedUser,
}) {
  const { fullName } = displayedUser;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 bg-white dark:bg-[#2e2c2c] p-6 rounded-2xl shadow-xl w-[32rem] max-w-full">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
          {`Unfriend ${fullName}?`}
        </h2>

        <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
          {`Are you sure you want to unfriend ${fullName}?`}
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="py-2 px-4 bg-transparent text-gray-700 dark:text-white border border-gray-400 dark:border-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

WarningDeleteFriend.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  displayedUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    fullName: PropTypes.string.isRequired,
  }).isRequired,
};
