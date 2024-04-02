import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataWithTotal } from '@app/types/common.type';
import { Org } from '@app/types/org.type';
import { UserInviteData, UserWithRole } from '@app/types/user.type';
import { startWith, Subject, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  readonly #refreshSubject = new Subject<void>();
  public readonly refresh$ = this.#refreshSubject
    .asObservable()
    .pipe(startWith(undefined));

  readonly #ROUTES = {
    users: 'users',
    invite: 'users/invite',
  };
  readonly #http = inject(HttpClient);

  public getAll() {
    return this.#http.get<DataWithTotal<Org>>(
      `${environment.api}/${this.#ROUTES.users}`,
      {
        withCredentials: true,
      },
    );
  }

  public inviteUser(user: UserInviteData) {
    return this.refresh$.pipe(
      switchMap(() => {
        return this.#http.post<UserWithRole>(
          `${environment.api}/${this.#ROUTES.invite}`,
          {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          },
          {
            withCredentials: true,
          },
        );
      }),
    );
  }

  public refresh(): void {
    this.#refreshSubject.next();
  }
}
