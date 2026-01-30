/**
 * Job Manager - In-memory storage for background jobs
 * This can be replaced with Redis or a database for production
 */

class JobManager {
  constructor() {
    this.jobs = new Map();
  }

  /**
   * Create a new job
   * @param {string} jobId - Unique job identifier
   * @param {object} metadata - Additional job metadata
   * @returns {object} Job object
   */
  createJob(jobId, metadata = {}) {
    const job = {
      jobId,
      status: "processing",
      progress: 0,
      result: null,
      error: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...metadata,
    };

    this.jobs.set(jobId, job);
    return job;
  }

  /**
   * Get job by ID
   * @param {string} jobId
   * @returns {object|null} Job object or null
   */
  getJob(jobId) {
    return this.jobs.get(jobId) || null;
  }

  /**
   * Update job status
   * @param {string} jobId
   * @param {object} updates - Fields to update
   */
  updateJob(jobId, updates) {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    const updatedJob = {
      ...job,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.jobs.set(jobId, updatedJob);
    return updatedJob;
  }

  /**
   * Mark job as completed
   * @param {string} jobId
   * @param {object} result
   */
  completeJob(jobId, result) {
    return this.updateJob(jobId, {
      status: "completed",
      progress: 100,
      result,
    });
  }

  /**
   * Mark job as failed
   * @param {string} jobId
   * @param {string|object} error
   */
  failJob(jobId, error) {
    return this.updateJob(jobId, {
      status: "failed",
      error:
        typeof error === "string" ? error : error.message || "Unknown error",
    });
  }

  /**
   * Delete old jobs (cleanup)
   * @param {number} maxAgeMs - Maximum age in milliseconds
   */
  cleanup(maxAgeMs = 24 * 60 * 60 * 1000) {
    // Default: 24 hours
    const now = Date.now();
    for (const [jobId, job] of this.jobs.entries()) {
      const jobAge = now - new Date(job.createdAt).getTime();
      if (jobAge > maxAgeMs) {
        this.jobs.delete(jobId);
      }
    }
  }

  /**
   * Get all jobs (for debugging/monitoring)
   * @returns {Array} Array of all jobs
   */
  getAllJobs() {
    return Array.from(this.jobs.values());
  }
}

// Singleton instance
const jobManager = new JobManager();

// Cleanup old jobs every hour
setInterval(
  () => {
    jobManager.cleanup();
  },
  60 * 60 * 1000,
);

module.exports = jobManager;
