import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, switchMap, take } from 'rxjs';
import { AccessService } from '../access/access.service';
import { AuthService } from '../auth/auth.service';
import { EnvironmentsService } from '../environments/environments.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  readonly #authService = inject(AuthService);
  readonly #projectsService = inject(ProjectsService);
  readonly #environmentsService = inject(EnvironmentsService);
  readonly #accessService = inject(AccessService);

  init() {
    return this.#authService.fetchUserDetails().pipe(
      switchMap(() => this.#accessService.init()),
      take(1),
      catchError(() => {
        return EMPTY;
      }),
    );
  }
}
