import React, { useState } from 'react';
import Calculator from '../components/Calculator';
import CurrencyConverter from '../components/CurrencyConverter';
import '../App.css';

function Home() {
  const [active, setActive] = useState('Calculator');
  const handleActive = (item: string) => {
    setActive(item);
  };

  let componentToRender;
  if (active === 'Calculator') {
    componentToRender = <Calculator />;
  } else if (active === 'Converter') {
    componentToRender = <CurrencyConverter />;
  }

  let activeName =
    active === 'Calculator' ? (
      <p>Calculator</p>
    ) : active === 'Converter' ? (
      <p>Converter</p>
    ) : (
      ''
    );
  const buttonStyle = (buttonId: string) => ({
    backgroundColor: active === buttonId ? 'green' : 'black',
  });
  return (
    <div className='container'>
      <span className='active-name'>{activeName}</span>
      <nav>
        <button
          style={buttonStyle('Converter')}
          onClick={() => handleActive('Converter')}
          className='switch-btn con-btn'
        >
          Converter
        </button>
        <button
          style={buttonStyle('Calculator')}
          onClick={() => handleActive('Calculator')}
          className='switch-btn cal-btn'
        >
          Calculator
        </button>
      </nav>
      <main>{componentToRender}</main>
    </div>
  );
}

export default Home;
