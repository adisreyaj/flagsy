import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { UserMeta } from '@app/types/user.type';
import { isNil } from 'lodash-es';
import { catchError, EMPTY, map, take } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly account: Signal<UserMeta | undefined>;
  readonly isLoggedIn: Signal<boolean>;

  readonly #account = signal<UserMeta | undefined>(undefined);
  readonly #http: HttpClient = inject(HttpClient);

  constructor() {
    this.account = this.#account.asReadonly();
    this.isLoggedIn = computed(() => {
      return !isNil(this.#account());
    });
  }

  fetchUserDetails() {
    return this.#http
      .get<UserMeta>(`${environment.api}/auth/me`, {
        withCredentials: true,
      })
      .pipe(
        take(1),
        map((user: UserMeta) => {
          this.#account.set(user);
          return;
        }),
        catchError(() => {
          this.#account.set(undefined);
          return EMPTY;
        }),
      );
  }

  login(email: string, password: string) {
    return this.#http
      .post<UserMeta>(
        `${environment.api}/auth/login`,
        { email, password },
        {
          withCredentials: true,
        },
      )
      .pipe(
        map((user: UserMeta) => {
          this.#account.set(user);
          return;
        }),
      );
  }
}
