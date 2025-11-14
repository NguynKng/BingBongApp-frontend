import PropTypes from "prop-types";

export default function PlaceOrderModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-md shadow-xl w-[32rem] animate-fade-in">
        <div className="w-48 h-48 mx-auto">
          <img
            src="/order-success.png"
            alt="Order Successful"
            className="w-full h-full object-cover rounded-t-md"
          />
        </div>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-semibold text-green-600">
            Order placed successfully!
          </h2>
          <p className="mt-2 text-gray-600">Thank you for shopping with us. Your order is currently being processed.</p>
          <button
            onClick={onClose}
            className="mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

PlaceOrderModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
