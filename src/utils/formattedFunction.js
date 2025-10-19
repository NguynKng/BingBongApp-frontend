const formatPriceWithDollar = (num) => {
  return "$" + parseFloat(num).toFixed(2);
};

export { formatPriceWithDollar };
