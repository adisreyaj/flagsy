import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  FeatureChangelogResponse,
  FeatureChangelogSortKey,
} from '@app/types/changelog.type';
import { Pagination, SortBy } from '@app/types/common.type';
import { FlatFilter } from '@ui/types';
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
    filters?: FlatFilter;
  }): Observable<FeatureChangelogResponse> {
    return this.#http.get<FeatureChangelogResponse>(
      `${environment.api}/changelog`,
      {
        params: {
          ...QueryParamUtil.buildSortParam(args?.sort),
          ...QueryParamUtil.buildPaginationParam(args?.pagination),
          ...QueryParamUtil.buildFilterParam(args?.filters),
        },
        withCredentials: true,
      },
    );
  }
}
