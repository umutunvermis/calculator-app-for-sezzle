/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Calculator from './components/Calculator';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-light tracking-tight text-white mb-2">Calculator</h1>
      </div>
      <Calculator />
    </div>
  );
}
