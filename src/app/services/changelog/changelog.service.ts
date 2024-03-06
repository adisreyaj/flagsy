import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FeatureChangelogSortBy } from '@app/types/changelog.type';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  #http = inject(HttpClient);

  getChangelogs(args?: { sort?: FeatureChangelogSortBy }) {
    return this.#http.get(`${environment.api}/changelog`, {
      params: {
        ...(args?.sort?.key && { sortBy: args.sort.key }),
        ...(args?.sort?.direction && { direction: args.sort.direction }),
      },
      withCredentials: true,
    });
  }
}
