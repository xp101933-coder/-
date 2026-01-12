
import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, FileWarning } from 'lucide-react';

interface FileUploaderProps {
  onUpload: (file: File) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('画像ファイル（jpg, png等）を選択してください。');
      return;
    }
    setError(null);
    onUpload(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [onUpload]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [onUpload]);

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative group border-2 border-dashed rounded-[2.5rem] transition-all duration-300 flex flex-col items-center justify-center p-12 text-center cursor-pointer min-h-[400px] ${
          isDragging 
            ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]' 
            : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50'
        }`}
      >
        <div className={`p-6 rounded-full transition-transform duration-500 ${
          isDragging ? 'bg-indigo-100 scale-110' : 'bg-gray-100 group-hover:scale-110'
        } mb-6`}>
          <Upload size={48} className={isDragging ? 'text-indigo-600' : 'text-gray-400 group-hover:text-indigo-500'} />
        </div>
        
        <h3 className="text-2xl font-bold text-gray-800 mb-2">ここに画像をドロップ</h3>
        <p className="text-gray-500 mb-8 max-w-sm">
          またはファイルを選択してアップロードしてください。
          高解像度の画像もサポートしています。
        </p>

        <label className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 transition-all active:scale-95 cursor-pointer">
          ファイルを選択
          <input type="file" className="hidden" accept="image/*" onChange={handleFileInput} />
        </label>

        {error && (
          <div className="absolute bottom-6 flex items-center gap-2 text-red-500 animate-bounce">
            <FileWarning size={16} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <ImageIcon size={20} />, title: "高品質出力", desc: "画質を落とさずきれいに分割" },
          { icon: <Upload size={20} />, title: "ブラウザ完結", desc: "サーバーに保存されないから安心" },
          { icon: <ImageIcon size={20} />, title: "モバイル対応", desc: "スマホでもサクサク操作" }
        ].map((feat, i) => (
          <div key={i} className="flex flex-col items-center p-6 bg-gray-50 rounded-3xl text-center">
            <div className="mb-3 text-indigo-500">{feat.icon}</div>
            <h4 className="font-bold text-gray-800 mb-1">{feat.title}</h4>
            <p className="text-xs text-gray-500">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
