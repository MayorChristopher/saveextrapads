export const convertToUSD = async (amountInNGN) => {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/NGN");
    const data = await res.json();
    const rate = data.rates?.USD || 0.0013; // Fallback rate
    const usdAmount = amountInNGN * rate;
    return parseFloat(usdAmount.toFixed(2));
  } catch (err) {
    console.error("Currency conversion failed", err);
    return null;
  }
};
