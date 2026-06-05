const formatNumberPrice = ({
    number = 0,
    hasCurrencySymbol = "₫",
    nation = "de-DE",
} = {}) => {
    return new Intl.NumberFormat(nation).format(number) + hasCurrencySymbol;
};

export { formatNumberPrice };
