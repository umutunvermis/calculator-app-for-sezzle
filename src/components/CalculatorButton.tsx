import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
}

export default function CalculatorButton({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  let bgClass = '';
  switch (variant) {
    case 'primary':
      bgClass = 'bg-neutral-800 hover:bg-neutral-700 text-white';
      break;
    case 'secondary':
      bgClass = 'bg-neutral-700 hover:bg-neutral-600 text-white';
      break;
    case 'accent':
      bgClass = 'bg-indigo-500 hover:bg-indigo-400 text-white';
      break;
  }

  return (
    <button
      className={`h-14 rounded-full flex items-center justify-center text-xl font-medium transition-colors active:scale-95 ${bgClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
