import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  FeatureChangelogResponse,
  FeatureChangelogSortKey,
} from '@app/types/changelog.type';
import { SortBy } from '@app/types/common.type';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SortUtil } from '../../utils/sort.util';

@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  #http = inject(HttpClient);

  getChangelogs(args?: {
    sort?: SortBy<FeatureChangelogSortKey>;
  }): Observable<FeatureChangelogResponse> {
    return this.#http.get<FeatureChangelogResponse>(
      `${environment.api}/changelog`,
      {
        params: {
          ...SortUtil.buildSortParam(args?.sort),
        },
        withCredentials: true,
      },
    );
  }
}
