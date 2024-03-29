import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// TODO: Use facade for local storage
export class PreferenceService {
  public saveActiveProjectId(projectId: string) {
    localStorage.setItem(PreferenceKey.ActiveProject, projectId);
  }

  public getActiveProjectId() {
    return localStorage.getItem(PreferenceKey.ActiveProject) ?? undefined;
  }

  public saveActiveEnvironmentId(environmentId: string) {
    localStorage.setItem(PreferenceKey.ActiveEnvironment, environmentId);
  }

  public getActiveEnvironmentId() {
    return localStorage.getItem(PreferenceKey.ActiveEnvironment) ?? undefined;
  }
}

export enum PreferenceKey {
  ActiveProject = 'activeProject',
  ActiveEnvironment = 'activeEnvironment',
}
