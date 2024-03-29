import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DataWithTotal, isNotUndefined } from '@app/types/common.type';
import {
  Environment,
  EnvironmentCreateInput,
  EnvironmentUpdateInput,
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
import { PreferenceService } from '../preference/preference.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsService {
  readonly #environments: WritableSignal<Environment[]> = signal([]);
  public readonly environments = this.#environments.asReadonly();

  readonly #activeEnvironmentSubject = new BehaviorSubject<
    Environment | undefined
  >(undefined);
  public readonly activeEnvironment$: Observable<Environment> =
    this.#activeEnvironmentSubject.asObservable().pipe(filter(isNotUndefined));

  public readonly activeEnvironment: Signal<Environment | undefined> = toSignal(
    this.activeEnvironment$,
    {
      initialValue: undefined,
    },
  );

  readonly #refreshSubject = new Subject<void>();
  readonly #refresh$: Observable<void> = this.#refreshSubject
    .asObservable()
    .pipe(startWith(undefined));

  readonly #http = inject(HttpClient);
  readonly #projectService = inject(ProjectsService);
  readonly #preferenceService = inject(PreferenceService);

  public constructor() {
    this.#projectService.activeProject$
      .pipe(
        filter(isNotUndefined),
        switchMap((activeProject: Project) =>
          this.#getAllEnvironments(activeProject.id),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((environments) => {
        this.#updateEnvironments(environments.data);
      });
  }

  public createEnvironment(data: EnvironmentCreateInput): Observable<string> {
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

  public updateEnvironment({
    id,
    ...data
  }: EnvironmentUpdateInput): Observable<string> {
    return this.#http
      .patch<string>(
        `${environment.api}/environments/${id}`,
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

  public getEnvironmentSelectOptions = (): Signal<SelectOption<string>[]> => {
    return computed(() => {
      return this.environments().map((env) => ({
        label: env.name,
        value: env.id,
      }));
    });
  };

  public setActiveEnvironment = (environmentId: string) => {
    const environment = this.environments().find(
      (env) => env.id === environmentId,
    );
    if (environment) {
      this.#activeEnvironmentSubject.next(
        this.environments().find((env) => env.id === environmentId),
      );
      this.#preferenceService.saveActiveEnvironmentId(environmentId);
    }
  };

  #getAllEnvironments = (projectId?: string) => {
    return this.#refresh$.pipe(
      switchMap(() =>
        this.#http.get<DataWithTotal<Environment>>(
          `${environment.api}/environments`,
          {
            params: {
              ...(!isEmpty(projectId)
                ? {
                    projectId,
                  }
                : {}),
            },
            withCredentials: true,
          },
        ),
      ),
    );
  };

  #updateEnvironments(environments: Environment[]): void {
    if (!isEmpty(environments)) {
      this.#environments.set(environments);
      const savedEnvironmentId =
        this.#preferenceService.getActiveEnvironmentId();
      const savedEnvironment = this.environments().find(
        (env) => env.id === savedEnvironmentId,
      );
      this.#activeEnvironmentSubject.next(savedEnvironment ?? environments[0]);
    }
  }
}
