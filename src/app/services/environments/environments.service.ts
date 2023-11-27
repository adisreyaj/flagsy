import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { isNotUndefined } from '@app/types/common.type';
import {
  Environment,
  EnvironmentCreateInput,
} from '@app/types/environment.type';
import { Project } from '@app/types/project.type';
import { isEmpty } from 'lodash-es';
import { filter, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SelectOption } from '../../shared/components/select.type';
import { ProjectsService } from '../projects/projects.service';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsService {
  readonly activeEnvironment = signal<Environment | undefined>(undefined);
  readonly environments: Signal<Environment[]>;

  readonly #refreshSubject = new Subject<void>();
  readonly #refresh$: Observable<void> = this.#refreshSubject
    .asObservable()
    .pipe(startWith(undefined));
  readonly #http = inject(HttpClient);
  readonly #projectService = inject(ProjectsService);

  constructor() {
    this.environments = toSignal(
      this.#projectService.activeProject$
        .pipe(
          filter(isNotUndefined),
          switchMap((activeProject: Project) =>
            this.#getAllEnvironments(activeProject.id),
          ),
          tap((environments) => {
            if (this.activeEnvironment()?.id !== environments?.[0]?.id) {
              this.activeEnvironment.set(environments?.[0]);
            }
          }),
        )
        .pipe(takeUntilDestroyed()),
      {
        initialValue: [],
      },
    );
  }

  #getAllEnvironments = (projectId?: string) => {
    return this.#refresh$.pipe(
      switchMap(() =>
        this.#http.get<Environment[]>(`${environment.api}/environments`, {
          params: {
            ...(!isEmpty(projectId)
              ? {
                  projectId,
                }
              : {}),
          },
          withCredentials: true,
        }),
      ),
    );
  };

  createEnvironment(data: EnvironmentCreateInput): Observable<string> {
    return this.#http.post<string>(
      `${environment.api}/environments`,
      {
        ...data,
      },
      {
        withCredentials: true,
      },
    );
  }

  getEnvironmentSelectOptions = (): Signal<SelectOption<string>[]> => {
    return computed(() => {
      return this.environments().map((env) => ({
        label: env.name,
        value: env.id,
      }));
    });
  };

  setActiveEnvironment = (environmentId: string) => {
    this.activeEnvironment.set(
      this.environments().find((env) => env.id === environmentId),
    );
  };
}
