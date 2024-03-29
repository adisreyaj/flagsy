import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, switchMap, take } from 'rxjs';
import { AccessService } from '../access/access.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class InitService {
  readonly #authService = inject(AuthService);
  readonly #accessService = inject(AccessService);

  public init() {
    return this.#authService.fetchUserDetails().pipe(
      switchMap(() => this.#accessService.init()),
      take(1),
      catchError(() => {
        return EMPTY;
      }),
    );
  }
}
