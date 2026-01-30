import { checkJobStatus } from '@/lib/actions/analysis.action';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseJobPollingOptions {
  jobId: string | null;
  interval?: number; // in milliseconds, default 60000 (1 minute)
  onCompleted?: (result: any) => void;
  onFailed?: (error: any) => void;
}

interface JobStatus {
  status: 'idle' | 'processing' | 'completed' | 'failed';
  progress: number;
  result: any;
  error: any;
  message: string;
}

export const useJobPolling = ({
  jobId,
  interval = 60000, // Default: 1 minute
  onCompleted,
  onFailed,
}: UseJobPollingOptions) => {
  const [jobStatus, setJobStatus] = useState<JobStatus>({
    status: 'idle',
    progress: 0,
    result: null,
    error: null,
    message: '',
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompletedRef = useRef(onCompleted);
  const onFailedRef = useRef(onFailed);

  // Update refs when callbacks change
  useEffect(() => {
    onCompletedRef.current = onCompleted;
    onFailedRef.current = onFailed;
  }, [onCompleted, onFailed]);

  const pollJobStatus = useCallback(async () => {
    if (!jobId) return;

    try {
      const response = await checkJobStatus(jobId);

      if (response.success) {
        if (response.status === 'processing') {
          setJobStatus({
            status: 'processing',
            progress: response.progress || 0,
            result: null,
            error: null,
            message: response.message || 'Processing...',
          });
        } else if (response.status === 'completed') {
          setJobStatus({
            status: 'completed',
            progress: 100,
            result: response,
            error: null,
            message: response.message || 'Completed',
          });

          // Clear interval when completed
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          onCompletedRef.current?.(response);
        } else if (response.status === 'failed') {
          setJobStatus({
            status: 'failed',
            progress: 0,
            result: null,
            error: response.error,
            message: 'Failed',
          });

          // Clear interval when failed
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }

          onFailedRef.current?.(response.error);
        }
      } else {
        // Error in checking status
        setJobStatus({
          status: 'failed',
          progress: 0,
          result: null,
          error: response.error || response.message,
          message: 'Failed to check status',
        });

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }

        onFailedRef.current?.(response.error || response.message);
      }
    } catch (error) {
      console.error('Polling error:', error);
      setJobStatus({
        status: 'failed',
        progress: 0,
        result: null,
        error,
        message: 'Polling error',
      });

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      onFailedRef.current?.(error);
    }
  }, [jobId]); // Only depend on jobId

  useEffect(() => {
    if (!jobId) return;

    // Initial poll immediately
    pollJobStatus();

    // Set up interval for subsequent polls
    intervalRef.current = setInterval(pollJobStatus, interval);

    // Cleanup on unmount or when jobId changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [jobId, interval, pollJobStatus]);

  return jobStatus;
};
