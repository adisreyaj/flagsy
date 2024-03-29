import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataWithTotal } from '@app/types/common.type';
import { Org } from '@app/types/org.type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  #http = inject(HttpClient);

  public getAll() {
    return this.#http.get<DataWithTotal<Org>>(`${environment.api}/users`, {
      withCredentials: true,
    });
  }
}
