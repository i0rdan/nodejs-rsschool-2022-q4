import { EOL } from 'node:os';
import { join } from 'node:path';
import { appendFile, stat, readdir } from 'node:fs/promises';

import { ConsoleLogger, Injectable, OnModuleDestroy } from '@nestjs/common';

import { from, Subject, switchMap } from 'rxjs';

@Injectable()
export class LoggingService extends ConsoleLogger implements OnModuleDestroy {
  private saveToFileSubject = new Subject<any>();

  private logFileMaxSize = Number(process.env.LOG_FILE_MAX_SIZE) || 2000;

  private currLogLevel = Number(process.env.LOG_LEVEL) || 4;

  private allLogLevels = ['log', 'error', 'warn', 'debug', 'verbose'];

  private activeLogLevels = this.allLogLevels.filter(
    (_, i) => i <= this.currLogLevel,
  );

  private saveToFileSub = this.saveToFileSubject
    .pipe(
      switchMap((message) => {
        const logsDir = join(process.cwd(), 'logs');
        const logMessage = `${EOL}[${new Date().toLocaleString()}] - ${message}${EOL}`;

        return from(readdir(logsDir)).pipe(
          switchMap((currFiles) => {
            if (!currFiles.length) {
              return from(
                appendFile(join(logsDir, '1_log_file.log'), logMessage),
              );
            }

            const lastFile = currFiles[currFiles.length - 1];
            return from(stat(join(logsDir, lastFile))).pipe(
              switchMap(({ size }) => {
                if (size / 1000 < this.logFileMaxSize) {
                  return from(appendFile(join(logsDir, lastFile), logMessage));
                }
                const [fileNumber] = lastFile.split('_');
                return from(
                  appendFile(
                    join(logsDir, `${Number(fileNumber) + 1}_log_file.log`),
                    logMessage,
                  ),
                );
              }),
            );
          }),
        );
      }),
    )
    .subscribe();

  log(message: any, ...params: any[]): void {
    if (this.activeLogLevels.includes('log')) {
      super.log(message, params);
      this.saveToFileSubject.next(message);
    }
  }

  error(message: any, ...params: any[]): void {
    if (this.activeLogLevels.includes('error')) {
      super.error(message, params);
      this.saveToFileSubject.next(message);
    }
  }

  warn(message: any, ...params: any[]): void {
    if (this.activeLogLevels.includes('warn')) {
      super.warn(message, params);
      this.saveToFileSubject.next(message);
    }
  }

  debug(message: any, ...params: any[]): void {
    if (this.activeLogLevels.includes('debug')) {
      super.debug(message, params);
      this.saveToFileSubject.next(message);
    }
  }

  verbose(message: any, ...params: any[]): void {
    if (this.activeLogLevels.includes('verbose')) {
      super.verbose(message, params);
      this.saveToFileSubject.next(message);
    }
  }

  onModuleDestroy() {
    this.saveToFileSub.unsubscribe();
  }
}
