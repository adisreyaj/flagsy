import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { UserWithRole } from '@app/types/user.type';
import { isNil } from 'lodash-es';
import { catchError, map, Observable, of, take, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly account: Signal<UserWithRole | undefined>;
  public readonly isLoggedIn: Signal<boolean>;

  readonly #account = signal<UserWithRole | undefined>(undefined);
  readonly #http: HttpClient = inject(HttpClient);

  public constructor() {
    this.account = this.#account.asReadonly();
    this.isLoggedIn = computed(() => {
      return !isNil(this.#account());
    });
  }

  public fetchUserDetails(): Observable<UserWithRole | undefined> {
    return this.#http
      .get<UserWithRole>(`${environment.api}/auth/me`, {
        withCredentials: true,
      })
      .pipe(
        take(1),
        map((user: UserWithRole) => {
          this.#account.set(user);
          return user;
        }),
        catchError(() => {
          this.#account.set(undefined);
          return of(undefined);
        }),
      );
  }

  public login(email: string, password: string) {
    return this.#http
      .post<UserWithRole>(
        `${environment.api}/auth/login`,
        { email, password },
        {
          withCredentials: true,
        },
      )
      .pipe(
        tap((user: UserWithRole) => {
          this.#account.set(user);
        }),
      );
  }

  public logout() {
    return this.#http
      .get(`${environment.api}/auth/logout`, { withCredentials: true })
      .pipe(
        tap(() => {
          this.#account.set(undefined);
        }),
      );
  }
}
