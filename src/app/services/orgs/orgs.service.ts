import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataWithTotal } from '@app/types/common.type';
import { Org } from '@app/types/org.type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrgsService {
  #http = inject(HttpClient);

  getAll() {
    return this.#http.get<DataWithTotal<Org>>(`${environment.api}/orgs`, {
      withCredentials: true,
    });
  }
}
