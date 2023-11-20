import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Project, ProjectCreateInput } from '@app/types/project.type';
import { Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SelectOption } from '../../shared/components/select.type';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  public readonly activeProject = signal<Project | undefined>(undefined);

  private readonly projects: Signal<Project[]>;
  private readonly refreshSubject = new Subject<void>();
  private readonly refresh$: Observable<void> = this.refreshSubject
    .asObservable()
    .pipe(startWith(undefined));

  private readonly http = inject(HttpClient);

  constructor() {
    this.projects = toSignal(this.getAllProjects(), {
      initialValue: [],
    });
  }

  getAllProjects = () => {
    return this.refresh$.pipe(
      switchMap(() =>
        this.http.get<Project[]>(`${environment.api}/projects`, {
          withCredentials: true,
        }),
      ),
      tap((projects) => {
        if (!this.activeProject()) {
          this.activeProject.set(projects?.[0]);
        }
      }),
    );
  };

  createProject = (data: ProjectCreateInput): Observable<string> => {
    return this.http
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
            this.refreshSubject.next();
          },
        }),
      );
  };

  getProjectSelectOptions = (): Signal<SelectOption<string>[]> => {
    return computed(() => {
      return this.projects().map((project) => ({
        label: project.name,
        value: project.id,
      }));
    });
  };

  setActiveProject = (projectId: string) => {
    this.activeProject.set(this.projects().find((p) => p.id === projectId));
  };
}
