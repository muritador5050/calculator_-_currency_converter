// src/utils/api.ts
export async function fetchExchangeRates(): Promise<{ [key: string]: number }> {
  const apiKey = process.env.REACT_APP_API_KEY;
  const currencies = 'EUR,USD,CAD,GBP,JPY,AUD,NGN';

  const url = `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=${currencies}`;
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.data) {
      const rates: { [key: string]: number } = {};
      for (const currency in data.data) {
        if (data.data.hasOwnProperty(currency)) {
          rates[currency] = data.data[currency].value;
        }
      }
      return rates;
    } else {
      throw new Error('Invalid API response.');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unknown error occured');
    }
  }
}

export type OperationProps = {
  currentOperand: string;
  previousOperand: string;
  operation: string | null;
};

export type ACTIONTYPE =
  | { type: 'add-digit'; payload: string }
  | { type: 'choose-operation'; payload: string }
  | { type: 'clear' }
  | { type: 'delete-digit' }
  | { type: 'evaluate' }
  | { type: 'percentage' };

export type CurrencyState = {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  convertedAmount: string;
  exchangeRates: { [key: string]: number } | null;
  error: string | null;
};

export type CurrencyAction =
  | { type: 'SET_FROM_CURRENCY'; payload: string }
  | { type: 'SET_TO_CURRENCY'; payload: string }
  | { type: 'SET_AMOUNT'; payload: string }
  | { type: 'SET_CONVERTED_AMOUNT'; payload: string }
  | { type: 'SET_EXCHANGE_RATES'; payload: { [key: string]: number } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'DELETE' }
  | { type: 'REFRESH' };
