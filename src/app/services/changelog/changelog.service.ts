import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  FeatureChangelogResponse,
  FeatureChangelogSortKey,
} from '@app/types/changelog.type';
import { Pagination, SortBy } from '@app/types/common.type';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QueryParamUtil } from '../../utils/query-param.util';

@Injectable({
  providedIn: 'root',
})
export class ChangelogService {
  #http = inject(HttpClient);

  getChangelogs(args?: {
    sort?: SortBy<FeatureChangelogSortKey>;
    pagination?: Pagination;
  }): Observable<FeatureChangelogResponse> {
    return this.#http.get<FeatureChangelogResponse>(
      `${environment.api}/changelog`,
      {
        params: {
          ...QueryParamUtil.buildSortParam(args?.sort),
          ...QueryParamUtil.buildPaginationParam(args?.pagination),
        },
        withCredentials: true,
      },
    );
  }
}
