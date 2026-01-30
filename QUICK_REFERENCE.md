# Background Job System - Quick Reference

## API Endpoints

### 1. Start Analysis (Returns Job ID)

```http
POST /api/v1/analysis/analyze-file
Content-Type: multipart/form-data

file: <file>
filterOption: "all" | "recommended"
```

**Response**:

```json
{
  "success": true,
  "jobId": "job_1738268400000_a1b2c3d4e5f6g7h8",
  "status": "processing",
  "message": "Analysis started. Use the jobId to check progress."
}
```

### 2. Check Job Status (Polling Endpoint)

```http
GET /api/v1/analysis/job/:jobId
```

**Response (Processing)**:

```json
{
  "success": true,
  "jobId": "job_...",
  "status": "processing",
  "progress": 0,
  "message": "Analysis in progress"
}
```

**Response (Completed)**:

```json
{
  "success": true,
  "jobId": "job_...",
  "status": "completed",
  "message": "Analysis completed successfully",
  "downloadUrl": "/api/v1/analysis/download/result.xlsx",
  "excelFile": "result.xlsx",
  "dataSource": "...",
  "summary": {...},
  "onpageResults": [...],
  "keywordMapping": [...]
}
```

**Response (Failed)**:

```json
{
  "success": false,
  "jobId": "job_...",
  "status": "failed",
  "error": {
    "message": "Error description",
    "details": "..."
  }
}
```

### 3. Download Result

```http
GET /api/v1/analysis/download/:filename
```

## Frontend Usage

### Using the Job Polling Hook

```typescript
import { useJobPolling } from '@/hooks/use-job-polling';

function MyComponent() {
  const [jobId, setJobId] = useState<string | null>(null);

  const jobStatus = useJobPolling({
    jobId,
    interval: 60000, // Poll every 1 minute
    onCompleted: (result) => {
      console.log('Job completed!', result);
      // Navigate to results or update UI
    },
    onFailed: (error) => {
      console.error('Job failed!', error);
      // Show error message
    },
  });

  // Start a job
  const startJob = async () => {
    const response = await fetch('/api/v1/analysis/analyze-file', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (data.success && data.jobId) {
      setJobId(data.jobId); // This triggers polling
    }
  };

  return (
    <div>
      <button onClick={startJob}>Start Analysis</button>
      {jobStatus.status === 'processing' && (
        <p>Processing... {jobStatus.progress}%</p>
      )}
    </div>
  );
}
```

### Using the Server Action

```typescript
import { checkJobStatus } from "@/lib/actions/analysis.action";

// In a server component or server action
const status = await checkJobStatus("job_123...");

if (status.status === "completed") {
  console.log("Results:", status);
}
```

## Backend Usage

### Job Manager Methods

```javascript
const jobManager = require('./libs/utils/job-manager');

// Create a job
const job = jobManager.createJob('job_123', {
  filename: 'data.csv',
  filterOption: 'all',
});

// Get job status
const job = jobManager.getJob('job_123');

// Update job
jobManager.updateJob('job_123', {
  progress: 50,
  status: 'processing',
});

// Complete job
jobManager.completeJob('job_123', {
  downloadUrl: '/download/result.xlsx',
  summary: {...},
});

// Fail job
jobManager.failJob('job_123', 'Error message');

// Get all jobs (for debugging)
const allJobs = jobManager.getAllJobs();

// Manual cleanup
jobManager.cleanup(3600000); // Remove jobs older than 1 hour
```

### Creating a Background Job

```javascript
function myController(req, res) {
  // 1. Generate job ID
  const jobId = generateJobId();

  // 2. Create job
  jobManager.createJob(jobId, {
    // metadata
  });

  // 3. Start background process
  processInBackground(jobId, data);

  // 4. Return immediately
  res.json({
    success: true,
    jobId,
    status: "processing",
  });
}

function processInBackground(jobId, data) {
  // Do work...

  // On success
  jobManager.completeJob(jobId, result);

  // On failure
  jobManager.failJob(jobId, error);
}
```

## Configuration

### Change Polling Interval

**Client-side** (`file-upload-form.tsx`):

```typescript
const jobStatus = useJobPolling({
  jobId,
  interval: 30000, // 30 seconds instead of 1 minute
  // ...
});
```

### Change Job Timeout

**Server-side** (`file-analyze.controller.js`):

```javascript
const timeout = setTimeout(() => {
  python.kill();
  jobManager.failJob(jobId, {
    message: "Analysis timeout",
    details: "The analysis took too long",
  });
}, 300000); // 5 minutes instead of 10
```

### Change Cleanup Interval

**Server-side** (`job-manager.js`):

```javascript
// Cleanup every 30 minutes instead of 1 hour
setInterval(
  () => {
    jobManager.cleanup();
  },
  30 * 60 * 1000,
);

// Or change max age
jobManager.cleanup(12 * 60 * 60 * 1000); // 12 hours
```

## Testing

### Manual Testing Steps

1. **Test Job Creation**:

   ```bash
   curl -X POST http://localhost:3001/api/v1/analysis/analyze-file \
     -F "file=@test.csv" \
     -F "filterOption=all"
   ```

   Expected: Returns `jobId`

2. **Test Job Status**:

   ```bash
   curl http://localhost:3001/api/v1/analysis/job/job_1738268400000_abc123
   ```

   Expected: Returns job status

3. **Test Frontend**:
   - Upload file via UI
   - Observe loading screen
   - Check browser DevTools Network tab for polling requests
   - Verify navigation to results when complete

### Debugging

**Check all jobs**:

```javascript
// In server console or endpoint
const jobManager = require("./src/libs/utils/job-manager");
console.log(jobManager.getAllJobs());
```

**Monitor polling**:

```typescript
// In browser console
const jobStatus = useJobPolling({
  jobId: "job_...",
  interval: 60000,
  onCompleted: (result) => console.log("✅ Completed:", result),
  onFailed: (error) => console.error("❌ Failed:", error),
});
```

## Common Issues

### Issue: Job not found

**Cause**: Job expired (24 hours old) or jobId incorrect  
**Solution**: Check jobId is correct, reduce cleanup interval if needed

### Issue: Polling not stopping

**Cause**: Callbacks not clearing jobId state  
**Solution**: Ensure `setJobId(null)` in callbacks

### Issue: Loading screen stuck

**Cause**: Job failed but frontend didn't receive update  
**Solution**: Add error boundary, check network requests

### Issue: Job times out

**Cause**: Python script takes longer than 10 minutes  
**Solution**: Increase timeout or optimize Python script

## Monitoring

### Log Job Events

```javascript
// In job-manager.js
createJob(jobId, metadata) {
  console.log(`[JOB] Created: ${jobId}`, metadata);
  // ...
}

completeJob(jobId, result) {
  console.log(`[JOB] Completed: ${jobId}`);
  // ...
}

failJob(jobId, error) {
  console.error(`[JOB] Failed: ${jobId}`, error);
  // ...
}
```

### Track Metrics

```javascript
// Add to job-manager.js
getStats() {
  const jobs = this.getAllJobs();
  return {
    total: jobs.length,
    processing: jobs.filter(j => j.status === 'processing').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  };
}
```

## Migration Path to Production

### 1. Replace with Redis

```javascript
const Redis = require("ioredis");
const redis = new Redis(process.env.REDIS_URL);

class RedisJobManager {
  async createJob(jobId, metadata) {
    await redis.setex(
      `job:${jobId}`,
      86400,
      JSON.stringify({ jobId, status: "processing", ...metadata }),
    );
  }

  async getJob(jobId) {
    const data = await redis.get(`job:${jobId}`);
    return data ? JSON.parse(data) : null;
  }

  // ... implement other methods
}
```

### 2. Add Queue System

```javascript
const Queue = require("bull");
const analysisQueue = new Queue("analysis", process.env.REDIS_URL);

analysisQueue.process(async (job) => {
  const { uploadedFilePath, filterOption, pyScriptPath, resultsDir } = job.data;
  // Process analysis
  return result;
});

// In controller
analysisQueue.add({
  uploadedFilePath,
  filterOption,
  pyScriptPath,
  resultsDir,
});
```

### 3. Add WebSocket

```javascript
const io = require("socket.io")(server);

io.on("connection", (socket) => {
  socket.on("subscribe-job", (jobId) => {
    socket.join(`job:${jobId}`);
  });
});

// In processAnalysisJob
jobManager.completeJob(jobId, result);
io.to(`job:${jobId}`).emit("job-completed", result);
```
