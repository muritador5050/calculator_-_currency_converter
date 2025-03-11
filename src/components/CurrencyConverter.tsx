import React, { useEffect, useReducer, useState } from 'react';
import Button from './Button';
import '../App.css';
import { colorstyle } from './Calculator';
import { fetchExchangeRates } from '../utils/api';
type CurrencyState = {
  fromCurrency: string;
  toCurrency: string;
  amount: string;
  convertedAmount: string;
  exchangeRates: { [key: string]: number } | null;
  error: string | null;
};

type CurrencyAction =
  | { type: 'SET_FROM_CURRENCY'; payload: string }
  | { type: 'SET_TO_CURRENCY'; payload: string }
  | { type: 'SET_AMOUNT'; payload: string }
  | { type: 'SET_CONVERTED_AMOUNT'; payload: string }
  | { type: 'SET_EXCHANGE_RATES'; payload: { [key: string]: number } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR' }
  | { type: 'DELETE' }
  | { type: 'REFRESH' };
const initialState: CurrencyState = {
  fromCurrency: 'USD',
  toCurrency: 'EUR',
  amount: '',
  convertedAmount: '',
  exchangeRates: null,
  error: null,
};
function currencyReducer(
  state: CurrencyState,
  action: CurrencyAction
): CurrencyState {
  switch (action.type) {
    case 'SET_FROM_CURRENCY':
      return { ...state, fromCurrency: action.payload };
    case 'SET_TO_CURRENCY':
      return { ...state, toCurrency: action.payload };
    case 'SET_AMOUNT':
      return { ...state, amount: action.payload };
    case 'SET_CONVERTED_AMOUNT':
      return { ...state, convertedAmount: action.payload };
    case 'SET_EXCHANGE_RATES':
      return { ...state, exchangeRates: action.payload, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'DELETE':
      if (state.amount === '') return state;
      return { ...state, amount: state.amount.slice(0, -1) };
    case 'CLEAR':
      return { ...state, convertedAmount: '' };
    case 'REFRESH':
      return {
        ...state,
        amount: '',
        fromCurrency: 'USD',
      };
    default:
      return state;
  }
}
const currencySymbols: { [key: string]: string } = {
  EUR: '€',
  USD: '$',
  CAD: '$',
  GBP: '£',
  JPY: '¥',
  AUD: '$',
  NGN: '₦',
};
function CurrencyConverter() {
  const [
    { fromCurrency, toCurrency, amount, convertedAmount, exchangeRates, error },
    dispatch,
  ] = useReducer(currencyReducer, initialState);

  const [currencies, setCurrencies] = useState<string[]>([]);
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const rates = await fetchExchangeRates();
        dispatch({ type: 'SET_EXCHANGE_RATES', payload: rates });
        setCurrencies(Object.keys(rates));
      } catch (err) {
        if (err instanceof Error) {
          dispatch({ type: 'SET_ERROR', payload: err.message });
        } else {
          dispatch({ type: 'SET_ERROR', payload: 'An unknown error occured' });
        }
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    const handleConvert = () => {
      if (!amount) {
        dispatch({ type: 'SET_CONVERTED_AMOUNT', payload: '' });
        return;
      }

      if (isNaN(parseFloat(amount))) {
        dispatch({ type: 'SET_ERROR', payload: 'Invalid amount.' });
        return;
      }

      if (exchangeRates && amount) {
        const rate = exchangeRates[toCurrency];

        if (rate) {
          const result = (parseFloat(amount) * rate).toFixed(2);
          const symbol = currencySymbols[toCurrency] || '';
          dispatch({
            type: 'SET_CONVERTED_AMOUNT',
            payload: `${symbol}${result}`,
          });
        } else {
          dispatch({
            type: 'SET_ERROR',
            payload: 'Currency conversion rate not found.',
          });
        }
      }
    };
    handleConvert();
  }, [amount, fromCurrency, toCurrency, exchangeRates, dispatch]);
  const handleDigitClick = (digit: string) => {
    dispatch({
      type: 'SET_AMOUNT',
      payload: amount + digit,
    });
  };

  return (
    <div className='converter'>
      <div className='converter-box'>
        <div className='select-section'>
          <select
            value={fromCurrency}
            onChange={(e) =>
              dispatch({ type: 'SET_FROM_CURRENCY', payload: e.target.value })
            }
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <select
            value={toCurrency}
            onChange={(e) =>
              dispatch({ type: 'SET_TO_CURRENCY', payload: e.target.value })
            }
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
        <div className='amount-input'>
          <section className='amount-display'>
            {currencySymbols[fromCurrency] || ''}
            {amount} {fromCurrency}
          </section>
        </div>
        <section className='converted-amount'>
          {convertedAmount && (
            <>
              {convertedAmount} {toCurrency}
            </>
          )}
          {error && <p className='error'>{error}</p>}
        </section>
      </div>
      <div className='clear-and-refresh'>
        <Button
          style={colorstyle}
          onClick={() => {
            dispatch({ type: 'REFRESH' });
          }}
        >
          <span>&#8634;</span>
        </Button>

        <Button style={colorstyle} onClick={() => dispatch({ type: 'CLEAR' })}>
          C
        </Button>
      </div>
      <div className='converter-grid'>
        <Button onClick={() => handleDigitClick('1')}>1</Button>
        <Button onClick={() => handleDigitClick('2')}>2</Button>
        <Button onClick={() => handleDigitClick('3')}>3</Button>

        <Button onClick={() => handleDigitClick('4')}>4</Button>
        <Button onClick={() => handleDigitClick('5')}>5</Button>
        <Button onClick={() => handleDigitClick('6')}>6</Button>

        <Button onClick={() => handleDigitClick('7')}>7</Button>
        <Button onClick={() => handleDigitClick('8')}>8</Button>
        <Button onClick={() => handleDigitClick('9')}>9</Button>

        <Button onClick={() => handleDigitClick('.')}>.</Button>
        <Button onClick={() => handleDigitClick('0')}>0</Button>
        <Button style={colorstyle} onClick={() => dispatch({ type: 'DELETE' })}>
          <span> &#x2B8C;</span>
        </Button>
      </div>
    </div>
  );
}

export default CurrencyConverter;
