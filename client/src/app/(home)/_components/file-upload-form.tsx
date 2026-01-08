'use client';

import Load from '@/components/feature/file-scan-loading';
import { Button } from '@/components/ui/button';
import { fileUploadAction } from '@/lib/actions/file-upload.action';
import { cn } from '@/lib/utils/cn';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useRowCount } from './../../../hooks/use-row-count';
import GoogleButton from './google-button';

type DragEventType = React.DragEvent<HTMLDivElement>;
type ChangeEventType = React.ChangeEvent<HTMLInputElement>;
type FormEventType = React.FormEvent<HTMLFormElement>;

export default function FileUploadForm() {
  // Navigation
  const router = useRouter();

  // State
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  // const [rowCount, setRowCount] = useState(10);
  const { rowCount, calculateRows } = useRowCount();

  // Ref
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Drag & Drop Handlers
  const handleDragOver = (e: DragEventType) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEventType) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) setFile(droppedFile);
  };

  // File Input Handler
  const handleFileChange = (e: ChangeEventType) => {
    const pickedFile = e.target.files?.[0];
    if (pickedFile) setFile(pickedFile);
  };

  // Form Submit Handler
  const handleSubmit = async (e: FormEventType) => {
    e.preventDefault();
    if (!file) return alert('Please select a file first!');

    const ext = file.name.toLowerCase();
    const type = ext.endsWith('.csv') ? 'csv' : 'excel';

    await calculateRows(file, type);

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);

    try {
      const response = await fileUploadAction(formData);

      if (response.success) {
        sessionStorage.setItem('analysisResult', JSON.stringify(response));

        router.push('/result');
        return;
      } else {
        alert('Error: ' + response.message);
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='w-[320px] rounded-3xl bg-white/40 p-4 shadow-2xl backdrop-blur-xl md:w-[420px] md:p-10'
      >
        <div className='flex flex-col items-center text-center'>
          {/* Drag & Drop Zone */}
          <div
            className={cn(
              'mt-5 flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-2 transition',
              isDragging
                ? 'border-[#8b5a9e] bg-[#8b5a9e]/10'
                : 'border-[#c9b4d3] bg-white/40'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <Image
              src='/assets/images/upload.png'
              alt='Scarbio'
              width={150}
              height={100}
              className='object-contain p-2'
            />
            <p className='mt-4 text-lg font-medium text-[#6f3a83]'>
              Drag & Drop your files here
            </p>
            <p className='text-sm text-[#6f3a83]/70'>or click to browse</p>
          </div>

          {/* Hidden File Input */}
          <input
            ref={inputRef}
            type='file'
            onChange={handleFileChange}
            className='hidden'
            accept='.csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          />

          {/* File Preview */}
          {file && (
            <div className='mt-4 w-full rounded-xl bg-white/60 p-4 text-left text-[#6f3a83] shadow'>
              <p className='font-semibold'>Selected File:</p>
              <p className='truncate text-sm'>{file.name}</p>
              <p className='text-xs opacity-70'>
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={isUploading}
            className='mt-3 md:mt-10'
          >
            Analyze
            <ChevronRight className='ms-2 inline-block size-9 transition-transform duration-300' />
          </Button>
        </div>

        {/* analyze with data */}
        <GoogleButton />
      </form>

      {isUploading && <Load rows={rowCount} />}
    </>
  );
}
