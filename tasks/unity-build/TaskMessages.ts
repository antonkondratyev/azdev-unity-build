import * as tl from 'vsts-task-lib/task';

/**
* Class with all messages defined in task.json
*/
export default class TaskMessages {

    /**
     * Checking Unity path: %s
     */
    public checkUnityPath(a: string): string {
        return tl.loc('CheckUnityPath', a);
    }

    /**
     * Unity path not defined automatically or can't be a found on %s OS. Set the path manually.
     */
    public unityPathNotFound(a: string): string {
        return tl.loc('UnityPathNotFound', a);
    }

    /**
     * Copying %s to %s
     */
    public copyLogFile(a: string, b: string): string {
        return tl.loc('CopyLogFile', a, b);
    }

    /**
     * %s can't be copied to the %s for a reason: %s
     */
    public copyLogFileFailed(a: string, b: string, c: string): string {
        return tl.loc('CopyLogFileFailed', a, b, c);
    }

    /**
     * Unity process exited with code: %d
     */
    public unityExitCode(a: string): string {
        return tl.loc('UnityExitCode', a);
    }

    /**
     * This is not full Unity log. Muted %s lines. Total processed %s lines.
     */
    public amountOfMutedLines(a: string, b: string): string {
        return tl.loc('AmountOfMutedLines', a, b);
    }

    /**
     * The task is Partially Successful because some Error messages were detected.
     */
    public partiallySuccessful(): string {
        return tl.loc('PartiallySuccessful');
    }

    /**
     * Task Uncaught Exception: %s
     */
    public uncaughtException(a: string): string {
        return tl.loc('UncaughtException', a);
    }

    /**
     * Muted %s lines by reason: %s
     */
    public mutedByReason(mutedLines: number, muteReason: string): string {
        return tl.loc('MutedByReason', mutedLines, muteReason);
    }

    /**
     * Mute Section: %s
     */
    public muteSection(a: string): string {
        return tl.loc('MuteSection', a);
    }

    /**
     * Found critical message line
     */
    public criticalMessage(): string {
        return tl.loc('CriticalMessage');
    }

    /**
     * Step %s
     */
    public progressMessage(a: string): string {
        return tl.loc('ProgressMessage', a);
    }

    /**
     * Unity stdout: %s
     */
    public unityStdOut(a: string): string {
        return tl.loc('UnityStdOut', a);
    }

    /**
     * Unity stderr: %s
     */
    public unityStdErr(a: string): string {
        return tl.loc('UnityStdErr', a);
    }

    /**
     * The operation was interrupted.
     */
    public unityInterrupted(): string {
        return tl.loc('UnityInterrupted');
    }

    /**
     * Terminating Unity process...
     */
    public unityTerminating(): string {
        return tl.loc('UnityTerminating');
    }

    /**
     * Terminating Unity process ID: %d
     */
    public unityTerminatingPid(a: string): string {
        return tl.loc('UnityTerminatingPid', a);
    }

    /**
     * Unity process terminated.
     */
    public unityTerminated(): string {
        return tl.loc('UnityTerminated');
    }

    /**
     * File %s not found.
     */
    public fileNotFound(a: string): string {
        return tl.loc('FileNotFound', a);
    }

    /**
     * Unity log file path: %s
     */
    public unityLogPath(a: string): string {
        return tl.loc('UnityLogPath', a);
    }

    /**
     * Started to listening Unity log file.
     */
    public unityLogListenStarted(): string {
        return tl.loc('UnityLogListenStarted');
    }

    /**
     * Stopped to listening Unity log file.
     */
    public unityLogListenStopped(): string {
        return tl.loc('UnityLogListenStopped');
    }

    /**
     * Cleaning Library/ScriptAssemblies folder.
     */
    public cleaningScriptAssemblies(): string {
        return tl.loc('CleaningScriptAssemblies');
    }

    /**
     * Cleaning Library/ScriptMapper file.
     */
    public cleaningScriptMapper(): string {
        return tl.loc('CleaningScriptMapper');
    }

    /**
     * Backuping Unity Library %s to %s
     */
    public unityLibraryBackuping(a: string, b: string): string {
        return tl.loc('UnityLibraryBackuping', a, b);
    }

    /**
     * The Unity Library can't be backuped.
     */
    public unityLibraryBackupFail(): string {
        return tl.loc('UnityLibraryBackupFail');
    }

    /**
     * Unity Library backuped to %s
     */
    public unityLibraryBackupSuccess(a: string): string {
        return tl.loc('UnityLibraryBackupSuccess', a);
    }

    /**
     * Restoring Unity Library %s to %s
     */
    public unityLibraryRestoring(a: string, b: string): string {
        return tl.loc('UnityLibraryRestoring', a, b);
    }

    /**
     * The Unity Library can't be restored.
     */
    public unityLibraryRestoreFail(): string {
        return tl.loc('UnityLibraryRestoreFail');
    }

    /**
     * Unity Library restored from %s
     */
    public unityLibraryRestoreSuccess(a: string): string {
        return tl.loc('UnityLibraryRestoreSuccess', a);
    }
}