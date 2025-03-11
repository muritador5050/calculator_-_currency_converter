import React, { useReducer } from 'react';
import Button from './Button';
import '../App.css';

//Color
export const colorstyle = {
  color: 'green',
};
const equalSign = {
  backgroundColor: 'transparent',
  border: 'none',
};
type OperationProps = {
  currentOperand: string;
  previousOperand: string;
  operation: string | null;
};
let initialValue: OperationProps = {
  currentOperand: '',
  previousOperand: '',
  operation: '',
};
type ACTIONTYPE =
  | { type: 'add-digit'; payload: string }
  | { type: 'choose-operation'; payload: string }
  | { type: 'clear' }
  | { type: 'delete-digit' }
  | { type: 'evaluate' }
  | { type: 'percentage' };

function reducer(state: OperationProps, action: ACTIONTYPE): OperationProps {
  switch (action.type) {
    case 'add-digit':
      if (action.payload === '0' && state.currentOperand === '0') return state;
      if (action.payload === '.' && state.currentOperand.includes('.'))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand}${action.payload}`,
      };
    case 'choose-operation':
      if (state.currentOperand === '' && state.previousOperand === '')
        return state;
      if (state.previousOperand === '') {
        return {
          ...state,
          operation: action.payload,
          previousOperand: state.currentOperand,
          currentOperand: '',
        };
      }
      return {
        ...state,
        operation: action.payload,
        previousOperand: evaluate(state),
        currentOperand: '',
      };
    case 'clear':
      return initialValue;
    case 'delete-digit':
      if (state.currentOperand === '') return state;
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case 'evaluate':
      if (
        state.operation == null ||
        state.previousOperand === '' ||
        state.currentOperand === ''
      )
        return state;
      return {
        ...state,
        currentOperand: evaluate(state),
        operation: null,
        previousOperand: '',
      };
    case 'percentage':
      if (state.previousOperand && state.operation) {
        const percentageValue = parseFloat(state.currentOperand) / 100;
        return {
          ...state,
          currentOperand: percentageValue.toString(),
        };
      } else {
        const percentageValue = parseFloat(state.currentOperand) / 100;
        return {
          ...state,
          currentOperand: percentageValue.toString(),
        };
      }
    default:
      return state;
  }
}

function evaluate({
  currentOperand,
  previousOperand,
  operation,
}: OperationProps): string {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return '';
  let computation = '';
  switch (operation) {
    case '+':
      computation = (prev + current).toString();
      break;
    case '-':
      computation = (prev - current).toString();
      break;
    case '*':
      computation = (prev * current).toString();
      break;
    case '/':
      computation = (prev / current).toString();
      break;
    case '%':
      computation = (current / 100).toString();
      break;
    default:
      return '';
  }
  return computation;
}

function Calculator() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    initialValue
  );
  return (
    <>
      <div className='calculator'>
        <div className='calculator-box'>
          <div className='previous-operand'>
            {previousOperand} {operation}
          </div>
          <div className='current-operand'>{currentOperand}</div>
        </div>
        <div className='cal-grid'>
          <Button
            style={colorstyle}
            onClick={() => dispatch({ type: 'clear' })}
          >
            C
          </Button>
          <Button
            onClick={() => dispatch({ type: 'choose-operation', payload: '/' })}
            style={colorstyle}
          >
            <span className='entity'>&divide;</span>
          </Button>
          <Button
            onClick={() => dispatch({ type: 'choose-operation', payload: '*' })}
            style={colorstyle} //multi
          >
            <span className='entity'>&#215;</span>
          </Button>

          <Button
            style={colorstyle}
            onClick={() => dispatch({ type: 'delete-digit' })}
          >
            <span> &#x2B8C;</span>
          </Button>

          <Button onClick={() => dispatch({ type: 'add-digit', payload: '7' })}>
            7
          </Button>
          <Button onClick={() => dispatch({ type: 'add-digit', payload: '8' })}>
            8
          </Button>
          <Button onClick={() => dispatch({ type: 'add-digit', payload: '9' })}>
            9
          </Button>
          <Button
            onClick={() => dispatch({ type: 'choose-operation', payload: '-' })}
            style={colorstyle} //minus
          >
            <span className='entity'>&minus;</span>
          </Button>

          <Button onClick={() => dispatch({ type: 'add-digit', payload: '4' })}>
            4
          </Button>
          <Button onClick={() => dispatch({ type: 'add-digit', payload: '5' })}>
            5
          </Button>
          <Button onClick={() => dispatch({ type: 'add-digit', payload: '6' })}>
            6
          </Button>
          <Button
            onClick={() => dispatch({ type: 'choose-operation', payload: '+' })}
            style={colorstyle} //plus
          >
            <span className='entity'>&#43;</span>
          </Button>
          <Button onClick={() => dispatch({ type: 'add-digit', payload: '1' })}>
            1
          </Button>
          <Button onClick={() => dispatch({ type: 'add-digit', payload: '2' })}>
            2
          </Button>
          <Button onClick={() => dispatch({ type: 'add-digit', payload: '3' })}>
            3
          </Button>
          <span className='equal-sign'>
            <Button
              onClick={() => dispatch({ type: 'evaluate' })}
              style={equalSign}
            >
              =
            </Button>
          </span>
          <Button onClick={() => dispatch({ type: 'percentage' })}>%</Button>
          <Button onClick={() => dispatch({ type: 'add-digit', payload: '0' })}>
            0
          </Button>
          <Button onClick={() => dispatch({ type: 'add-digit', payload: '.' })}>
            .
          </Button>
        </div>
      </div>
    </>
  );
}

export default Calculator;
