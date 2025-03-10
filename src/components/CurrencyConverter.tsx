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
  | { type: 'CLEAR' };
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
    case 'CLEAR':
      return { ...state, amount: '', convertedAmount: '' };
    default:
      return state;
  }
}

function CurrencyConverter() {
  const [state, dispatch] = useReducer(currencyReducer, initialState);
  const {
    fromCurrency,
    toCurrency,
    amount,
    convertedAmount,
    exchangeRates,
    error,
  } = state;
  const [currencies, setCurrencies] = useState<string[]>([]);
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const rates = await fetchExchangeRates(fromCurrency);
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
  }, [fromCurrency]);
  const handleConvert = () => {
    if (exchangeRates && amount) {
      const rate = exchangeRates[toCurrency];
      if (rate) {
        const result = (parseFloat(amount) * rate).toFixed(2);
        dispatch({ type: 'SET_CONVERTED_AMOUNT', payload: result });
      } else {
        dispatch({
          type: 'SET_ERROR',
          payload: 'Currency conversion rate not found.',
        });
      }
    }
  };

  const handleDigitClick = (digit: string) => {
    dispatch({ type: 'SET_AMOUNT', payload: state.amount + digit });
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR' });
  };
  return (
    <div className='converter'>
      <div className='converter-box'>
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
        <div className='amount-input'>
          <input
            type='text'
            value={amount}
            onChange={(e) =>
              dispatch({ type: 'SET_AMOUNT', payload: e.target.value })
            }
          />
        </div>
        <div className='converted-amount'>
          {convertedAmount && (
            <p>
              {convertedAmount} {toCurrency}
            </p>
          )}
          {error && <p className='error'>{error}</p>}
        </div>
        <Button style={colorstyle} onClick={handleConvert}>
          Convert
        </Button>
      </div>
      <section>
        <Button
          style={colorstyle}
          onClick={() => {
            dispatch({ type: 'SET_EXCHANGE_RATES', payload: {} });
          }}
        >
          his
        </Button>
        <Button style={colorstyle} onClick={() => {}}>
          ref
        </Button>
        <Button style={colorstyle} onClick={handleClear}>
          C
        </Button>
      </section>
      <section>
        <Button onClick={() => handleDigitClick('1')}>1</Button>
        <Button onClick={() => handleDigitClick('2')}>2</Button>
        <Button onClick={() => handleDigitClick('3')}>3</Button>
      </section>
      <section>
        <Button onClick={() => handleDigitClick('4')}>4</Button>
        <Button onClick={() => handleDigitClick('5')}>5</Button>
        <Button onClick={() => handleDigitClick('6')}>6</Button>
      </section>
      <section>
        <Button onClick={() => handleDigitClick('7')}>7</Button>
        <Button onClick={() => handleDigitClick('8')}>8</Button>
        <Button onClick={() => handleDigitClick('9')}>9</Button>
      </section>
      <section>
        <Button onClick={() => handleDigitClick('.')}>.</Button>
        <Button onClick={() => handleDigitClick('0')}>0</Button>
        <Button style={colorstyle} onClick={handleClear}>
          c
        </Button>
      </section>
    </div>
  );
}

export default CurrencyConverter;
