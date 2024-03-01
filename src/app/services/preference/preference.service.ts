import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// TODO: Use facade for local storage
export class PreferenceService {
  saveActiveProjectId(projectId: string) {
    localStorage.setItem(PreferenceKey.ActiveProject, projectId);
  }

  getActiveProjectId() {
    return localStorage.getItem(PreferenceKey.ActiveProject) ?? undefined;
  }

  saveActiveEnvironmentId(environmentId: string) {
    localStorage.setItem(PreferenceKey.ActiveEnvironment, environmentId);
  }

  getActiveEnvironmentId() {
    return localStorage.getItem(PreferenceKey.ActiveEnvironment) ?? undefined;
  }
}

export enum PreferenceKey {
  ActiveProject = 'activeProject',
  ActiveEnvironment = 'activeEnvironment',
}
