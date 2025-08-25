// Logger Utility - Centralized logging system
import { environmentHelper } from './env-helper';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  data?: any;
  source?: string;
  userId?: string;
  sessionId?: string;
  url?: string;
  userAgent?: string;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = LogLevel.INFO;
  private enableConsole: boolean = true;
  private enableRemote: boolean = false;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize: number = 1000;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeFromEnvironment();
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private initializeFromEnvironment(): void {
    const logLevelStr = environmentHelper.get('LOG_LEVEL', 'info').toLowerCase();
    
    switch (logLevelStr) {
      case 'debug':
        this.logLevel = LogLevel.DEBUG;
        break;
      case 'info':
        this.logLevel = LogLevel.INFO;
        break;
      case 'warn':
        this.logLevel = LogLevel.WARN;
        break;
      case 'error':
        this.logLevel = LogLevel.ERROR;
        break;
      case 'fatal':
        this.logLevel = LogLevel.FATAL;
        break;
      default:
        this.logLevel = LogLevel.INFO;
    }

    this.enableConsole = environmentHelper.get('ENABLE_CONSOLE_LOGS', true);
    this.enableRemote = environmentHelper.get('ENABLE_REMOTE_LOGGING', false);
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    source?: string
  ): LogEntry {
    return {
      level,
      message,
      timestamp: Date.now(),
      data,
      source,
      sessionId: this.sessionId,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined
    };
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatConsoleMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toISOString();
    const levelStr = LogLevel[entry.level];
    const source = entry.source ? `[${entry.source}]` : '';
    
    return `${timestamp} ${levelStr} ${source} ${entry.message}`;
  }

  private logToConsole(entry: LogEntry): void {
    if (!this.enableConsole || !this.shouldLog(entry.level)) {
      return;
    }

    const message = this.formatConsoleMessage(entry);
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message, entry.data);
        break;
      case LogLevel.INFO:
        console.info(message, entry.data);
        break;
      case LogLevel.WARN:
        console.warn(message, entry.data);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(message, entry.data);
        break;
    }
  }

  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);
    
    // Keep buffer size under limit
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!this.enableRemote) {
      return;
    }

    try {
      // This would typically send to your logging service
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Fallback to console if remote logging fails
      console.error('Failed to send log to remote service:', error);
    }
  }

  private log(level: LogLevel, message: string, data?: any, source?: string): void {
    const entry = this.createLogEntry(level, message, data, source);
    
    this.logToConsole(entry);
    this.addToBuffer(entry);
    
    if (this.enableRemote) {
      this.sendToRemote(entry).catch(() => {
        // Silent fail for remote logging
      });
    }
  }

  // Public logging methods
  public debug(message: string, data?: any, source?: string): void {
    this.log(LogLevel.DEBUG, message, data, source);
  }

  public info(message: string, data?: any, source?: string): void {
    this.log(LogLevel.INFO, message, data, source);
  }

  public warn(message: string, data?: any, source?: string): void {
    this.log(LogLevel.WARN, message, data, source);
  }

  public error(message: string, data?: any, source?: string): void {
    this.log(LogLevel.ERROR, message, data, source);
  }

  public fatal(message: string, data?: any, source?: string): void {
    this.log(LogLevel.FATAL, message, data, source);
  }

  // Specialized logging methods
  public apiRequest(method: string, url: string, data?: any): void {
    this.info(`API Request: ${method} ${url}`, data, 'API');
  }

  public apiResponse(method: string, url: string, status: number, data?: any): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.log(level, `API Response: ${method} ${url} - ${status}`, data, 'API');
  }

  public userAction(action: string, data?: any): void {
    this.info(`User Action: ${action}`, data, 'USER');
  }

  public performanceMetric(metric: string, value: number, unit: string = 'ms'): void {
    this.info(`Performance: ${metric} = ${value}${unit}`, { metric, value, unit }, 'PERFORMANCE');
  }

  public exception(error: Error, context?: string): void {
    this.error(`Exception${context ? ` in ${context}` : ''}: ${error.message}`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context
    }, 'EXCEPTION');
  }

  public security(event: string, data?: any): void {
    this.warn(`Security Event: ${event}`, data, 'SECURITY');
  }

  // Configuration methods
  public setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  public setConsoleLogging(enabled: boolean): void {
    this.enableConsole = enabled;
  }

  public setRemoteLogging(enabled: boolean): void {
    this.enableRemote = enabled;
  }

  public setMaxBufferSize(size: number): void {
    this.maxBufferSize = size;
  }

  // Utility methods
  public getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  public clearLogBuffer(): void {
    this.logBuffer = [];
  }

  public exportLogs(startTime?: number, endTime?: number): LogEntry[] {
    let logs = this.logBuffer;
    
    if (startTime) {
      logs = logs.filter(entry => entry.timestamp >= startTime);
    }
    
    if (endTime) {
      logs = logs.filter(entry => entry.timestamp <= endTime);
    }
    
    return logs;
  }

  public downloadLogs(filename?: string): void {
    const logs = this.getLogBuffer();
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = filename || `logs-${new Date().toISOString()}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public setUserId(userId: string): void {
    // This would be called after user login
    this.logBuffer.forEach(entry => {
      if (!entry.userId) {
        entry.userId = userId;
      }
    });
  }

  // Group related logs
  public group(label: string): void {
    if (this.enableConsole) {
      console.group(label);
    }
  }

  public groupEnd(): void {
    if (this.enableConsole) {
      console.groupEnd();
    }
  }

  // Timing utilities
  public time(label: string): void {
    if (this.enableConsole) {
      console.time(label);
    }
  }

  public timeEnd(label: string): void {
    if (this.enableConsole) {
      console.timeEnd(label);
    }
  }

  // Table logging
  public table(data: any): void {
    if (this.enableConsole) {
      console.table(data);
    }
  }

  // Assert logging
  public assert(condition: boolean, message: string, data?: any): void {
    if (!condition) {
      this.error(`Assertion failed: ${message}`, data, 'ASSERT');
      if (this.enableConsole) {
        console.assert(condition, message, data);
      }
    }
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Helper functions
export const log = {
  debug: (message: string, data?: any, source?: string) => logger.debug(message, data, source),
  info: (message: string, data?: any, source?: string) => logger.info(message, data, source),
  warn: (message: string, data?: any, source?: string) => logger.warn(message, data, source),
  error: (message: string, data?: any, source?: string) => logger.error(message, data, source),
  fatal: (message: string, data?: any, source?: string) => logger.fatal(message, data, source),
  
  // Specialized
  api: {
    request: (method: string, url: string, data?: any) => logger.apiRequest(method, url, data),
    response: (method: string, url: string, status: number, data?: any) => 
      logger.apiResponse(method, url, status, data)
  },
  
  user: (action: string, data?: any) => logger.userAction(action, data),
  performance: (metric: string, value: number, unit?: string) => 
    logger.performanceMetric(metric, value, unit),
  exception: (error: Error, context?: string) => logger.exception(error, context),
  security: (event: string, data?: any) => logger.security(event, data)
};
