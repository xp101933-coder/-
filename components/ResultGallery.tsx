
import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { SplitResult } from '../types';

interface ResultGalleryProps {
  results: SplitResult[];
  originalName: string;
}

const ResultGallery: React.FC<ResultGalleryProps> = ({ results, originalName }) => {
  const downloadImage = (url: string, index: number) => {
    const link = document.createElement('a');
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    link.href = url;
    link.download = `${baseName}_split_${index}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {results.map((result, idx) => (
        <div 
          key={result.id} 
          className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1"
        >
          <div className="aspect-[1/1] bg-gray-50 flex items-center justify-center overflow-hidden">
            <img 
              src={result.url} 
              alt={`Result ${idx + 1}`} 
              className="max-w-full max-h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          
          <div className="p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Part {idx + 1}</span>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-bold">PNG</span>
            </div>
            
            <button
              onClick={() => downloadImage(result.url, result.id)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 hover:bg-indigo-600 text-white rounded-2xl font-bold text-sm transition-all"
            >
              <Download size={16} />
              保存する
            </button>
            
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1 text-[10px] text-gray-400 hover:text-indigo-500 font-medium transition-colors"
            >
              新しいタブで開く <ExternalLink size={10} />
            </a>
          </div>

          <div className="absolute top-4 left-4">
             <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-800 font-bold text-sm shadow-sm">
                {idx + 1}
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultGallery;
