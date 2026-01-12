
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ImageData, SplitMode } from '../types';

interface SplitterControlProps {
  image: ImageData;
  splitMode: SplitMode;
  splitPoints: number[];
  onSplitPointsChange: (points: number[]) => void;
}

const SplitterControl: React.FC<SplitterControlProps> = ({ 
  image, 
  splitMode, 
  splitPoints, 
  onSplitPointsChange 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeHandle, setActiveHandle] = useState<number | null>(null);

  const handleMouseDown = (index: number) => (e: React.MouseEvent | React.TouchEvent) => {
    setActiveHandle(index);
    document.body.style.cursor = splitMode === 'vertical' ? 'col-resize' : 'row-resize';
    // Prevent scrolling while dragging on touch devices
    if (e.cancelable) e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (activeHandle === null || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    let percentage;
    if (splitMode === 'vertical') {
      percentage = ((clientX - rect.left) / rect.width) * 100;
    } else {
      percentage = ((clientY - rect.top) / rect.height) * 100;
    }

    // Constraints: between 0 and 100
    const newPoints = [...splitPoints];
    percentage = Math.max(0, Math.min(100, percentage));
    newPoints[activeHandle] = percentage;
    
    onSplitPointsChange(newPoints);
  }, [activeHandle, splitMode, splitPoints, onSplitPointsChange]);

  const handleMouseUp = useCallback(() => {
    setActiveHandle(null);
    document.body.style.cursor = 'default';
  }, []);

  useEffect(() => {
    if (activeHandle !== null) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [activeHandle, handleMouseMove, handleMouseUp]);

  return (
    <div className="relative w-full flex flex-col items-center bg-gray-50 rounded-3xl p-6 md:p-10 border border-gray-100 shadow-inner">
      <div 
        ref={containerRef}
        className="relative shadow-2xl bg-white ring-1 ring-gray-200 transition-all duration-300"
        style={{
          width: '100%',
          maxWidth: splitMode === 'vertical' ? '1200px' : `${(image.width / image.height) * 1200}px`,
          aspectRatio: `${image.width} / ${image.height}`,
          margin: '0 auto',
        }}
      >
        <img 
          src={image.url} 
          alt="Split preview" 
          className="w-full h-full object-contain pointer-events-none select-none block rounded-sm" 
        />
        
        {/* Split Lines Layer */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {splitPoints.map((point, i) => (
            <div
              key={i}
              className={`absolute flex items-center justify-center transition-colors group cursor-pointer pointer-events-auto ${
                splitMode === 'vertical' 
                  ? 'h-full w-10 top-0 -ml-5' 
                  : 'w-full h-10 left-0 -mt-5'
              }`}
              style={{
                [splitMode === 'vertical' ? 'left' : 'top']: `${point}%`
              }}
              onMouseDown={handleMouseDown(i)}
              onTouchStart={handleMouseDown(i)}
            >
              {/* The high-visibility line */}
              <div className={`
                ${splitMode === 'vertical' ? 'h-full w-[2px]' : 'w-full h-[2px]'} 
                bg-indigo-600 shadow-[0_0_10px_rgba(255,255,255,1),0_0_5px_rgba(79,70,229,0.5)] group-hover:bg-indigo-400 group-hover:w-[4px] group-active:bg-indigo-800 transition-all
              `}></div>
              
              {/* Handle badge */}
              <div className={`
                absolute shadow-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs rounded-lg
                w-8 h-8 border-2 border-white transform transition-transform ring-1 ring-black/5
                ${activeHandle === i ? 'scale-125 bg-indigo-700 ring-4 ring-indigo-100' : 'group-hover:scale-110'}
              `}>
                {i + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Labels for Segments (Visual Guide) */}
        <div className={`absolute inset-0 pointer-events-none grid opacity-30 ${splitMode === 'vertical' ? 'grid-cols-4' : 'grid-rows-4'}`}>
            {[1,2,3,4].map(n => (
                <div key={n} className="border border-white/40 flex items-center justify-center">
                    <span className="text-xl md:text-3xl text-white font-black drop-shadow-md select-none">P{n}</span>
                </div>
            ))}
        </div>
      </div>
      
      <div className="mt-8 flex items-center gap-2 text-gray-400">
        <span className="text-xs font-bold uppercase tracking-widest">Preview Mode: </span>
        <span className="text-xs font-medium text-gray-600">{image.width}px × {image.height}px</span>
      </div>
    </div>
  );
};

export default SplitterControl;
