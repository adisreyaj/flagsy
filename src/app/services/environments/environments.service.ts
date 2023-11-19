import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Environment,
  EnvironmentCreateInput,
} from '@app/types/environment.type';
import { Observable, startWith, Subject, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SelectOption } from '../../shared/components/select.type';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsService {
  private readonly environments: Signal<Environment[]>;
  private readonly refreshSubject = new Subject<void>();
  private readonly refresh$: Observable<void> = this.refreshSubject
    .asObservable()
    .pipe(startWith(undefined));
  private readonly http = inject(HttpClient);

  constructor() {
    this.environments = toSignal(this.getAllEnvironments(), {
      initialValue: [],
    });
  }

  getAllEnvironments = () => {
    return this.refresh$.pipe(
      switchMap(() =>
        this.http.get<Environment[]>(`${environment.api}/environments`, {
          withCredentials: true,
        }),
      ),
    );
  };

  createEnvironment(data: EnvironmentCreateInput): Observable<string> {
    return this.http.post<string>(
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
}
