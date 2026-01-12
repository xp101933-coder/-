
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Layout, Scissors, Download, Upload, RefreshCw, ChevronRight, ChevronDown, Split } from 'lucide-react';
import { ImageData, SplitMode, SplitResult } from './types';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import SplitterControl from './components/SplitterControl';
import ResultGallery from './components/ResultGallery';

const App: React.FC = () => {
  const [image, setImage] = useState<ImageData | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('vertical');
  const [splitPoints, setSplitPoints] = useState<number[]>([25, 50, 75]); // Percentage values
  const [results, setResults] = useState<SplitResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setImage({
        url,
        width: img.width,
        height: img.height,
        name: file.name
      });
      setResults([]);
    };
    img.src = url;
  }, []);

  const generateCrops = useCallback(async () => {
    if (!image) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = image.url;
    await new Promise((resolve) => {
      img.onload = resolve;
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sortedPoints = [0, ...[...splitPoints].sort((a, b) => a - b), 100];
    const newResults: SplitResult[] = [];

    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const startPct = sortedPoints[i];
      const endPct = sortedPoints[i + 1];
      const sizePct = endPct - startPct;

      let sx, sy, sw, sh;

      if (splitMode === 'vertical') {
        sx = (startPct / 100) * image.width;
        sy = 0;
        sw = (sizePct / 100) * image.width;
        sh = image.height;
      } else {
        sx = 0;
        sy = (startPct / 100) * image.height;
        sw = image.width;
        sh = (sizePct / 100) * image.height;
      }

      // Safeguard for very thin segments
      if (sw < 1) sw = 1;
      if (sh < 1) sh = 1;

      canvas.width = sw;
      canvas.height = sh;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      
      newResults.push({
        url: canvas.toDataURL('image/png'),
        id: i + 1
      });
    }

    setResults(newResults);
    setIsProcessing(false);
    
    // Smooth scroll to results
    setTimeout(() => {
      const el = document.getElementById('results-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [image, splitMode, splitPoints]);

  const reset = () => {
    setImage(null);
    setResults([]);
    setSplitPoints([25, 50, 75]);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 pb-20">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {!image ? (
          <div className="mt-8 md:mt-12">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-tight">
                画像を思い通りに、<br />
                <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">自由な位置で</span>分割
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl">
                ドラッグ操作で直感的に4枚の画像へ切り分けられます。<br className="hidden md:block" />
                インスタやブログ用の画像作成に最適です。
              </p>
            </div>
            <FileUploader onUpload={handleImageUpload} />
          </div>
        ) : (
          <div className="space-y-12">
            {/* Splitter Control Section */}
            <section className="bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl shadow-indigo-100/50">
              <div className="p-6 md:p-8 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-white rounded-t-[2.5rem]">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
                    <Scissors size={24} />
                  </div>
                  <div>
                    <h3 className="font-black text-2xl text-gray-900 leading-tight">分割エディタ</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Editor View</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex bg-gray-100 p-1.5 rounded-2xl shadow-inner">
                    <button
                      onClick={() => setSplitMode('vertical')}
                      className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${
                        splitMode === 'vertical' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      垂直に分割
                    </button>
                    <button
                      onClick={() => setSplitMode('horizontal')}
                      className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${
                        splitMode === 'horizontal' ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      水平に分割
                    </button>
                  </div>
                  
                  <button 
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-black text-gray-400 hover:text-red-500 transition-colors border-l border-gray-100"
                  >
                    <RefreshCw size={18} />
                    やり直す
                  </button>
                </div>
              </div>

              <div className="p-4 md:p-10 bg-white">
                <SplitterControl 
                  image={image} 
                  splitMode={splitMode} 
                  splitPoints={splitPoints} 
                  onSplitPointsChange={setSplitPoints} 
                />
              </div>

              <div className="p-8 md:p-12 bg-gray-50/70 border-t border-gray-100 flex flex-col items-center gap-6 rounded-b-[2.5rem]">
                <div className="text-center">
                  <p className="text-gray-600 font-bold mb-1">青いラインをドラッグして分割位置を調整してください</p>
                  <p className="text-xs text-gray-400 font-medium">※ 分割された画像はそれぞれ個別に保存できます。</p>
                </div>
                
                <button
                  onClick={generateCrops}
                  disabled={isProcessing}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-16 py-6 rounded-[2rem] font-black text-2xl shadow-2xl hover:shadow-indigo-300 transition-all flex items-center gap-5 active:scale-95 transform group"
                >
                  {isProcessing ? (
                    <RefreshCw className="animate-spin" />
                  ) : (
                    <Layout size={32} className="group-hover:rotate-12 transition-transform" />
                  )}
                  {isProcessing ? '画像を生成中...' : 'この位置で分割して確定'}
                </button>
              </div>
            </section>

            {/* Results Section */}
            {results.length > 0 && (
              <section id="results-section" className="space-y-10 py-16 border-t border-gray-100">
                <div className="text-center space-y-3">
                  <div className="inline-flex items-center gap-3 px-6 py-2 bg-green-50 rounded-full text-green-600 mb-2 border border-green-100 shadow-sm">
                    <Download size={20} className="animate-bounce" />
                    <span className="text-sm font-black uppercase tracking-widest">Success</span>
                  </div>
                  <h3 className="font-black text-4xl text-gray-900 tracking-tight">分割完了！</h3>
                  <p className="text-gray-500 text-lg">画像を1枚ずつダウンロードしてください。</p>
                </div>
                <ResultGallery results={results} originalName={image.name} />
              </section>
            )}
          </div>
        )}

        <footer className="mt-24 py-12 border-t border-gray-100 text-center">
          <p className="text-gray-400 text-sm font-bold tracking-widest uppercase">© 2025 Image Splitter Pro x Senior Frontend Engineer</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
