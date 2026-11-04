'use client';

import { useCallback, useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const ACCEPTED_TYPES: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'text/plain': 'TXT',
};

const ACCEPTED_EXTENSIONS = '.pdf,.docx,.pptx,.txt';
const MAX_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);

      if (!Object.keys(ACCEPTED_TYPES).includes(file.type)) {
        setError('Unsupported file type. Please upload PDF, DOCX, PPTX, or TXT.');
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError(`File too large. Maximum size is 20 MB (your file: ${formatBytes(file.size)}).`);
        return;
      }

      setSelectedFile(file);
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const file = e.dataTransfer.files?.[0];
      if (file) validateAndSelect(file);
    },
    [validateAndSelect],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSelect(file);
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !selectedFile && inputRef.current?.click()}
        className={cn(
          'relative flex flex-col items-center justify-center w-full rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer',
          'bg-ivory min-h-[200px] px-6 py-10 text-center',
          isDragActive
            ? 'border-editorial-blue bg-editorial-blue/5 scale-[1.01]'
            : 'border-black/20 hover:border-editorial-blue/50 hover:bg-soft-neutral',
          selectedFile && 'cursor-default',
        )}
      >
        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_EXTENSIONS}
          className="hidden"
          onChange={handleInputChange}
          aria-label="Upload file"
        />

        {selectedFile ? (
          /* File selected state */
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-editorial-blue/10 flex items-center justify-center">
              <FileText size={28} className="text-editorial-blue" />
            </div>
            <div>
              <p className="font-semibold text-ink text-base">{selectedFile.name}</p>
              <p className="text-sm text-ink/50 mt-1">
                {ACCEPTED_TYPES[selectedFile.type] ?? 'FILE'} · {formatBytes(selectedFile.size)}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); clearFile(); }}
              className="mt-1 flex items-center gap-1.5 text-sm text-ink/40 hover:text-red-500 transition-colors"
            >
              <X size={14} /> Remove file
            </button>
          </div>
        ) : (
          /* Upload prompt state */
          <div className="flex flex-col items-center gap-4">
            <div
              className={cn(
                'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-200',
                isDragActive ? 'bg-editorial-blue/15' : 'bg-editorial-blue/8',
              )}
            >
              <UploadCloud
                size={30}
                className={cn(
                  'transition-colors',
                  isDragActive ? 'text-editorial-blue' : 'text-editorial-blue/60',
                )}
              />
            </div>

            <div>
              <p className="text-ink font-semibold text-base">
                {isDragActive ? 'Drop your document here' : 'Drop your document here or browse files'}
              </p>
              <p className="text-ink/50 text-sm mt-1">
                Supports PDF, DOCX, PPTX, TXT · Max 20 MB
              </p>
            </div>

            {!isDragActive && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="mt-1 px-5 py-2 rounded-full bg-editorial-blue text-white text-sm font-semibold hover:bg-editorial-blue/90 transition-colors shadow-sm"
              >
                Browse Files
              </button>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium flex items-center gap-1.5">
          <X size={14} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
