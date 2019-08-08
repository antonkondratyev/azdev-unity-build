import * as tl from 'vsts-task-lib/task';

export default class SystemVariables {
    teamProject: string = tl.getVariable('System.TeamProject');
    artifactDirectory: string = tl.getVariable('Build.ArtifactStagingDirectory');
    sourcesDirectory: string = tl.getVariable('Build.SourcesDirectory');
}