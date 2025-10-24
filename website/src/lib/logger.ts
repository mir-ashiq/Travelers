// Logger service for production-ready logging
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  stack?: string;
  url?: string;
  userAgent?: string;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private createEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
    };
  }

  debug(message: string, data?: any) {
    const entry = this.createEntry('debug', message, data);
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data);
    }
    this.storeLog(entry);
  }

  info(message: string, data?: any) {
    const entry = this.createEntry('info', message, data);
    if (this.isDevelopment) {
      console.info(`[INFO] ${message}`, data);
    }
    this.storeLog(entry);
  }

  warn(message: string, data?: any) {
    const entry = this.createEntry('warn', message, data);
    console.warn(`[WARN] ${message}`, data);
    this.storeLog(entry);
  }

  error(message: string, error?: Error | any) {
    const entry = this.createEntry('error', message, {
      errorMessage: error?.message,
      errorCode: error?.code,
    });

    if (error instanceof Error) {
      entry.stack = error.stack;
    }

    console.error(`[ERROR] ${message}`, error);
    this.storeLog(entry);

    // Send critical errors to monitoring service
    if (typeof window !== 'undefined' && import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true') {
      this.sendToMonitoring(entry);
    }
  }

  private storeLog(entry: LogEntry) {
    this.logs.push(entry);

    // Prevent memory overflow
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }
  }

  private sendToMonitoring(_entry: LogEntry) {
    // Implementation for Sentry or similar service
    try {
      if (import.meta.env.VITE_SENTRY_DSN) {
        // Send to Sentry
        // const payload = {
        //   message: _entry.message,
        //   level: _entry.level,
        //   contexts: {
        //     logs: _entry.data,
        //   },
        //   tags: {
        //     environment: import.meta.env.VITE_ENVIRONMENT,
        //   },
        // };
        // Send to Sentry endpoint
      }
    } catch (err) {
      console.error('Failed to send error to monitoring service:', err);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
