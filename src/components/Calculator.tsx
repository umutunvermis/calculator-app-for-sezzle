import { useState } from 'react';
import { Operation } from '../types';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorKeypad from './CalculatorKeypad';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const inputDigit = (digit: string) => {
    setError(null);
    if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    setError(null);
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
    setError(null);
  };

  const backspace = () => {
    if (waitingForNewValue) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  const performOperation = async (nextOp: Operation) => {
    setError(null);
    const inputValue = parseFloat(display);

    if (previousValue == null) {
      // Immediate one-operand ops like sqrt and percentage can just run
      if (nextOp === 'sqrt' || nextOp === 'percentage') {
        await calculateResult(inputValue, undefined, nextOp);
      } else {
        setPreviousValue(inputValue);
        setOperation(nextOp);
        setWaitingForNewValue(true);
      }
    } else if (operation) {
      const currentValue = previousValue || 0;
      await calculateResult(currentValue, inputValue, operation);
      setOperation(nextOp);
      setWaitingForNewValue(true);
    }
  };

  const handleEquals = async () => {
    if (!operation || previousValue == null) return;
    const inputValue = parseFloat(display);
    await calculateResult(previousValue, inputValue, operation);
    setOperation(null);
    setPreviousValue(null);
    setWaitingForNewValue(true);
  };

  const calculateResult = async (a: number, b: number | undefined, op: Operation) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ a, b, operation: op }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Calculation failed');
      }

      setDisplay(String(data.result));
      setPreviousValue(data.result);
    } catch (err: any) {
      setError(err.message);
      setDisplay('Error');
      setPreviousValue(null);
      setOperation(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border border-neutral-800">
      <div className="p-6 bg-neutral-900">
        <CalculatorDisplay 
          display={display}
          previousValue={previousValue}
          operation={operation}
          waitingForNewValue={waitingForNewValue}
          error={error}
          loading={loading}
        />
        <CalculatorKeypad 
          onClear={clear}
          onBackspace={backspace}
          onPerformOperation={performOperation}
          onEquals={handleEquals}
          onInputDigit={inputDigit}
          onInputDecimal={inputDecimal}
        />
      </div>
    </div>
  );
}
