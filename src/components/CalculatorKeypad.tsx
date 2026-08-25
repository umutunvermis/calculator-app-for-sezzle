import { Delete, Divide, Equal, Minus, Percent, Plus, X } from 'lucide-react';
import { Operation } from '../types';
import CalculatorButton from './CalculatorButton';

interface CalculatorKeypadProps {
  onClear: () => void;
  onBackspace: () => void;
  onPerformOperation: (op: Operation) => void;
  onEquals: () => void;
  onInputDigit: (digit: string) => void;
  onInputDecimal: () => void;
}

export default function CalculatorKeypad({
  onClear,
  onBackspace,
  onPerformOperation,
  onEquals,
  onInputDigit,
  onInputDecimal
}: CalculatorKeypadProps) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <CalculatorButton variant="secondary" onClick={onClear}>AC</CalculatorButton>
      <CalculatorButton variant="secondary" onClick={onBackspace}><Delete className="w-5 h-5 mx-auto" /></CalculatorButton>
      <CalculatorButton variant="secondary" onClick={() => onPerformOperation('percentage')}><Percent className="w-5 h-5 mx-auto" /></CalculatorButton>
      <CalculatorButton variant="accent" onClick={() => onPerformOperation('divide')}><Divide className="w-5 h-5 mx-auto" /></CalculatorButton>

      <CalculatorButton variant="secondary" onClick={() => onPerformOperation('sqrt')}>&radic;x</CalculatorButton>
      <CalculatorButton variant="secondary" onClick={() => onPerformOperation('power')}>x<sup className="text-[10px]">y</sup></CalculatorButton>
      <CalculatorButton variant="secondary" className="col-span-1 invisible" onClick={() => {}}></CalculatorButton>
      <CalculatorButton variant="accent" onClick={() => onPerformOperation('multiply')}><X className="w-5 h-5 mx-auto" /></CalculatorButton>

      <CalculatorButton onClick={() => onInputDigit('7')}>7</CalculatorButton>
      <CalculatorButton onClick={() => onInputDigit('8')}>8</CalculatorButton>
      <CalculatorButton onClick={() => onInputDigit('9')}>9</CalculatorButton>
      <CalculatorButton variant="accent" onClick={() => onPerformOperation('subtract')}><Minus className="w-5 h-5 mx-auto" /></CalculatorButton>

      <CalculatorButton onClick={() => onInputDigit('4')}>4</CalculatorButton>
      <CalculatorButton onClick={() => onInputDigit('5')}>5</CalculatorButton>
      <CalculatorButton onClick={() => onInputDigit('6')}>6</CalculatorButton>
      <CalculatorButton variant="accent" onClick={() => onPerformOperation('add')}><Plus className="w-5 h-5 mx-auto" /></CalculatorButton>

      <CalculatorButton onClick={() => onInputDigit('1')}>1</CalculatorButton>
      <CalculatorButton onClick={() => onInputDigit('2')}>2</CalculatorButton>
      <CalculatorButton onClick={() => onInputDigit('3')}>3</CalculatorButton>
      <CalculatorButton variant="accent" onClick={onEquals}><Equal className="w-5 h-5 mx-auto" /></CalculatorButton>

      <CalculatorButton onClick={() => onInputDigit('0')}>0</CalculatorButton>
      <CalculatorButton onClick={onInputDecimal}>.</CalculatorButton>
    </div>
  );
}
