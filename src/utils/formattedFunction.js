const formatPriceWithDollar = (num) => {
  return "$" + parseFloat(num).toFixed(2);
};

const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
};

export { formatPriceWithDollar, formatNumber };
