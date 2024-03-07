import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FeatureChangelogSortKey } from '@app/types/changelog.type';
import { SortBy } from '@app/types/common.type';
import { environment } from '../../../environments/environment';
import { SortUtil } from '../../utils/sort.util';

@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  #http = inject(HttpClient);

  getChangelogs(args?: { sort?: SortBy<FeatureChangelogSortKey> }) {
    return this.#http.get(`${environment.api}/changelog`, {
      params: {
        ...SortUtil.buildSortParam(args?.sort),
      },
      withCredentials: true,
    });
  }
}
