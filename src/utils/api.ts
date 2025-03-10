// src/utils/api.ts
export async function fetchExchangeRates(): Promise<{ [key: string]: number }> {
  const apiKey = 'cur_live_s6VNvcqYp21OJtxKrUUzShPtFJXFZ0AWxKdameLy';
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
