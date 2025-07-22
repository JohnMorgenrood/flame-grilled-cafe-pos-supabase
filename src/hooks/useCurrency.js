import { useSettings } from '../contexts/SettingsContext';

export const useCurrency = () => {
  const { settings } = useSettings();

  const formatCurrency = (amount) => {
    const { symbol, position } = settings.currency;
    const formattedAmount = amount.toFixed(2);
    
    return position === 'before' 
      ? `${symbol}${formattedAmount}`
      : `${formattedAmount}${symbol}`;
  };

  const parseCurrency = (currencyString) => {
    // Remove currency symbol and parse to float
    const { symbol } = settings.currency;
    return parseFloat(currencyString.replace(symbol, '').trim());
  };

  return {
    formatCurrency,
    parseCurrency,
    currencySymbol: settings.currency.symbol,
    currencyCode: settings.currency.code
  };
};

// Hook for currency formatting without React context (for static usage)
export const formatCurrencyStatic = (amount, currency = { symbol: 'R', position: 'before' }) => {
  const formattedAmount = amount.toFixed(2);
  return currency.position === 'before' 
    ? `${currency.symbol}${formattedAmount}`
    : `${formattedAmount}${currency.symbol}`;
};

export default useCurrency;
