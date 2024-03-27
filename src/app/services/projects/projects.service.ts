import { HttpClient } from '@angular/common/http';
import {
  computed,
  inject,
  Injectable,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DataWithTotal, isNotUndefined } from '@app/types/common.type';
import { Project, ProjectCreateInput } from '@app/types/project.type';
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

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  readonly #activeProjectSubject = new BehaviorSubject<Project | undefined>(
    undefined,
  );
  public readonly activeProject$: Observable<Project> =
    this.#activeProjectSubject.asObservable().pipe(filter(isNotUndefined));

  public readonly activeProject: Signal<Project | undefined> = toSignal(
    this.activeProject$,
    {
      initialValue: undefined,
    },
  );

  readonly #projects: WritableSignal<Project[]> = signal([]);

  readonly #refreshSubject = new Subject<void>();
  readonly #refresh$: Observable<void> = this.#refreshSubject
    .asObservable()
    .pipe(startWith(undefined));

  readonly #http = inject(HttpClient);
  readonly #preferenceService = inject(PreferenceService);

  public constructor() {}

  // Will be called in the init service during app initialization
  public init() {
    this.getAllProjects()
      .pipe(
        tap((res) => {
          this.#projects.set(res.data);
          const savedProjectId = this.#preferenceService.getActiveProjectId();
          const savedProject = this.#projects().find(
            (proj) => proj.id === savedProjectId,
          );
          if (!this.#activeProjectSubject.value) {
            this.setActiveProject(savedProject?.id ?? res.data?.[0]?.id);
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  public getAllProjects = () => {
    return this.#refresh$.pipe(
      switchMap(() =>
        this.#http.get<DataWithTotal<Project>>(`${environment.api}/projects`, {
          withCredentials: true,
        }),
      ),
    );
  };

  public createProject = (data: ProjectCreateInput): Observable<string> => {
    return this.#http
      .post<string>(
        `${environment.api}/projects`,
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
  };

  public getProjectSelectOptions = (): Signal<SelectOption<string>[]> => {
    return computed(() => {
      return this.#projects().map((project) => ({
        label: project.name,
        value: project.id,
      }));
    });
  };

  public setActiveProject = (projectId: string) => {
    const project = this.#projects().find((p) => p.id === projectId);
    if (project) {
      this.#activeProjectSubject.next(project);
      this.#preferenceService.saveActiveProjectId(projectId);
    }
  };
}
