'use client';

import Load from '@/components/feature/file-scan-loading';
import { Button } from '@/components/ui/button';
import { useJobPolling } from '@/hooks/use-job-polling';
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
  const [jobId, setJobId] = useState<string | null>(null);
  const [analysisOption, setAnalysisOption] = useState<'recommended' | 'all'>(
    'recommended'
  );
  // const [rowCount, setRowCount] = useState(10);
  const { rowCount, calculateRows } = useRowCount();

  // Ref
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Job polling hook
  const jobStatus = useJobPolling({
    jobId,
    interval: 60000, // Poll every 1 minute
    onCompleted: result => {
      setIsUploading(false);
      setJobId(null);

      // Store result and navigate to result page
      sessionStorage.setItem('analysisResult', JSON.stringify(result));
      router.push('/result');
    },
    onFailed: error => {
      setIsUploading(false);
      setJobId(null);
      alert('Analysis failed: ' + (error?.message || error || 'Unknown error'));
    },
  });

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
    formData.append('filterOption', analysisOption);

    setIsUploading(true);

    try {
      const response = await fileUploadAction(formData);

      if (response.success && response.jobId) {
        // New behavior: Set jobId to start polling
        setJobId(response.jobId);
      } else if (response.success) {
        // Legacy behavior: Direct response (for backward compatibility)
        sessionStorage.setItem('analysisResult', JSON.stringify(response));
        router.push('/result');
        setIsUploading(false);
      } else {
        alert('Error: ' + response.message);
        setIsUploading(false);
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
      setIsUploading(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className='w-[300px] rounded-3xl bg-[#f5e6f0] p-6 shadow-2xl md:w-[460px] md:p-8'
      >
        <div className='flex flex-col items-center'>
          {/* Google Button */}
          <GoogleButton />

          {/* Divider with "Or" */}
          <div className='my-3 flex w-full items-center gap-4'>
            <div className='h-[2px] flex-1 bg-brand-soft'></div>
            <span className='text-lg font-medium text-brand-dark'>Or</span>
            <div className='h-[2px] flex-1 bg-brand-soft'></div>
          </div>

          {/* Drag & Drop Zone */}
          <div
            className={cn(
              'flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-[3px] border-dashed p-8 transition-all',
              isDragging
                ? 'border-[#8b5a9e] bg-white/60'
                : 'border-[#d4b5d4] bg-white/40'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <Image
              src='/assets/images/upload.png'
              alt='Upload'
              width={100}
              height={100}
              className='mb-4 object-contain'
            />
            <p className='text-center text-base font-medium text-[#8b5a9e]'>
              Drag & Drop your files here
            </p>
            <p className='mt-1 text-center text-sm text-[#8b5a9e]/70'>
              or click to browse
            </p>
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
            <div className='mt-4 w-full rounded-xl bg-white/80 p-4 text-left text-[#6f3a83] shadow-sm'>
              <p className='font-semibold'>Selected File:</p>
              <p className='truncate text-sm'>{file.name}</p>
              <p className='text-xs opacity-70'>
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          )}

          {/* Analysis Options - Radio Buttons */}
          {file && (
            <div className='mt-3 w-full rounded-xl bg-white/80 p-3 text-left text-[#6f3a83] shadow-sm'>
              <p className='mb-2 text-sm font-semibold'>Analysis Options:</p>
              <div className='space-y-1.5'>
                <label className='flex cursor-pointer items-start'>
                  <input
                    type='radio'
                    name='analysisOption'
                    value='recommended'
                    checked={analysisOption === 'recommended'}
                    onChange={() => setAnalysisOption('recommended')}
                    className='mr-2 mt-0.5 cursor-pointer accent-[#8b5a9e]'
                  />
                  <div>
                    <span className='text-sm font-medium'>
                      Recommended: Position 5-20 only
                    </span>
                    <span className='block text-xs opacity-70'>(Best ROI)</span>
                  </div>
                </label>
                <label className='flex cursor-pointer items-start'>
                  <input
                    type='radio'
                    name='analysisOption'
                    value='all'
                    checked={analysisOption === 'all'}
                    onChange={() => setAnalysisOption('all')}
                    className='mr-2 mt-0.5 cursor-pointer accent-[#8b5a9e]'
                  />
                  <div>
                    <span className='text-sm font-medium'>
                      All: Analyze all keywords
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type='submit'
            disabled={isUploading}
            className='mt-6 w-full rounded-full bg-[#9b7da8] px-8 py-6 text-base font-medium text-white hover:bg-[#8b5a9e] disabled:opacity-50 md:w-auto'
          >
            Analyze
            <ChevronRight className='ms-2 inline-block size-5' />
          </Button>
        </div>
      </form>

      {isUploading && <Load rows={rowCount} />}
    </>
  );
}
