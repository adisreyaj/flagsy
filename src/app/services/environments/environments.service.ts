import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isNotUndefined } from '@app/types/common.type';
import {
  Environment,
  EnvironmentCreateInput,
} from '@app/types/environment.type';
import { Project } from '@app/types/project.type';
import { isEmpty } from 'lodash-es';
import {
  BehaviorSubject,
  filter,
  Observable,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { SelectOption } from '../../shared/components/select.type';
import { ProjectsService } from '../projects/projects.service';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsService {
  readonly environments: WritableSignal<Environment[]> = signal([]);

  readonly #activeEnvironmentSubject = new BehaviorSubject<
    Environment | undefined
  >(undefined);
  readonly activeEnvironment$: Observable<Environment> =
    this.#activeEnvironmentSubject.asObservable().pipe(filter(isNotUndefined));

  readonly #refreshSubject = new Subject<void>();
  readonly #refresh$: Observable<void> = this.#refreshSubject
    .asObservable()
    .pipe(startWith(undefined));

  readonly #http = inject(HttpClient);
  readonly #projectService = inject(ProjectsService);

  constructor() {
    this.#projectService.activeProject$
      .pipe(
        filter(isNotUndefined),
        switchMap((activeProject: Project) =>
          this.#getAllEnvironments(activeProject.id),
        ),
        tap((environments) => {
          this.environments.set(environments);
          if (this.#activeEnvironmentSubject.value === undefined) {
            this.#activeEnvironmentSubject.next(environments[0]);
          }
        }),
      )
      .pipe(takeUntilDestroyed())
      .subscribe();
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
    return this.#http
      .post<string>(
        `${environment.api}/environments`,
        {
          ...data,
        },
        {
          withCredentials: true,
        },
      )
      .pipe(
        tap({
          next: () => {
            this.#refreshSubject.next();
          },
        }),
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
    this.#activeEnvironmentSubject.next(
      this.environments().find((env) => env.id === environmentId),
    );
  };
}
