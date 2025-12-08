export const formatIndianCurrency = (amount, showSymbol = false, decimals = 0) => {
    if (typeof amount !== 'number' || isNaN(amount)) {
        return showSymbol ? '₹ 0' : '0';
    }
    
    let num;
    if (decimals > 0) {
        num = amount.toFixed(decimals);
    } else {
        num = Math.round(amount).toString();
    }
    
    const [whole, decimal] = num.toString().split('.');
    const len = whole.length;
    
    if (len <= 3) {
        const result = decimal ? `${whole}.${decimal}` : whole;
        return showSymbol ? `₹ ${result}` : result;
    }
    
    let lastThree = whole.substring(len - 3);
    let otherNumbers = whole.substring(0, len - 3);
    
    if (otherNumbers !== '') {
        lastThree = ',' + lastThree;
    }
    
    const formattedWhole = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    const result = decimal ? `${formattedWhole}.${decimal}` : formattedWhole;
    
    return showSymbol ? `₹ ${result}` : result;
};