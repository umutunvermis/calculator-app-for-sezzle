import { Operation } from '../types';

interface CalculatorDisplayProps {
  display: string;
  previousValue: number | null;
  operation: Operation;
  waitingForNewValue: boolean;
  error: string | null;
  loading: boolean;
}

function getOperatorSymbol(op: Operation) {
  switch (op) {
    case 'add': return '+';
    case 'subtract': return '-';
    case 'multiply': return 'x';
    case 'divide': return '÷';
    case 'power': return '^';
    default: return '';
  }
}

export default function CalculatorDisplay({
  display,
  previousValue,
  operation,
  waitingForNewValue,
  error,
  loading
}: CalculatorDisplayProps) {
  return (
    <div className="flex flex-col items-end justify-end w-full h-24 mb-4 rounded-xl bg-neutral-800/50 p-4 border border-neutral-800 relative">
      {loading && (
        <div className="absolute top-2 left-2 text-xs text-neutral-400 animate-pulse">Calculating...</div>
      )}
      {error && (
         <div className="absolute top-2 right-2 text-xs text-red-400 max-w-[200px] truncate" title={error}>
           {error}
         </div>
      )}
      <div className="text-neutral-400 text-sm h-5 font-mono">
        {previousValue !== null && operation && !waitingForNewValue ? `${previousValue} ${getOperatorSymbol(operation)}` : ''}
      </div>
      <div className={`text-4xl font-light font-mono truncate w-full text-right ${error ? 'text-red-400' : 'text-white'}`}>
        {display}
      </div>
    </div>
  );
}
