
import React from 'react';
import { Scissors } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-indigo-200 shadow-lg">
            <Scissors size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Splitter <span className="text-indigo-600">Pro</span></h1>
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none">Smart Image Processor</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">使い方</a>
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">機能</a>
          <button className="text-sm font-bold bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-indigo-600 transition-all">
            無料
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
