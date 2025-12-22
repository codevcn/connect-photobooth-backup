import { EAppPage, ELogLevel } from '@/utils/enums'
import LoggingWorker from './LoggingWorker.ts?worker'
import { TLogEntry } from '@/utils/types/global'
import { typeToObject } from '@/utils/helpers'
import { TLoggingWorkerInput } from '@/utils/types/worker'

class AppLogger {
  worker: Worker

  constructor() {
    this.worker = new LoggingWorker()
  }

  logInfo(message: string, appPage: EAppPage, causedElement?: Element): void {
    setTimeout(() => {
      const entry = this.createLogEntry(ELogLevel.INFO, message, appPage, {
        className: causedElement?.className,
        id: causedElement?.id,
      })
      this.worker.postMessage(typeToObject<TLoggingWorkerInput>(entry))
    }, 0)
  }

  logError(error: Error, message: string, appPage: EAppPage, causedElement?: Element): void {
    setTimeout(() => {
      const entry = this.createLogEntry(
        ELogLevel.ERROR,
        message,
        appPage,
        {
          className: causedElement?.className,
          id: causedElement?.id,
        },
        error
      )
      this.worker.postMessage(typeToObject<TLoggingWorkerInput>(entry))
    }, 0)
  }

  private createLogEntry(
    level: ELogLevel,
    message: string,
    appPage: EAppPage,
    causedElement?: TLogEntry['causedElement'],
    error?: Error
  ): TLogEntry {
    const entry: TLogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      causedElement,
      appPage,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
      userAgent: navigator.userAgent,
    }
    return entry
  }
}

export const appLogger = new AppLogger()
