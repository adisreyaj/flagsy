import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Pagination, SortBy } from '@app/types/common.type';
import {
  Feature,
  FeatureCreateData,
  FeatureResponse,
  FeatureSortBy,
  FeatureUpdateData,
  FeatureValueType,
} from '@app/types/feature.type';
import { startCase } from 'lodash-es';
import { BehaviorSubject, finalize, map, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SelectOption } from '../../shared/components/select.type';
import { QueryParamUtil } from '../../utils/query-param.util';
import { EnvironmentsService } from '../environments/environments.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  readonly #refreshSubject = new BehaviorSubject<void>(undefined);
  public readonly refresh$ = this.#refreshSubject.asObservable();

  readonly #http = inject(HttpClient);
  readonly #environmentService = inject(EnvironmentsService);
  readonly #projectsService = inject(ProjectsService);

  public get currentProjectId$() {
    return this.#projectsService.activeProject$.pipe(
      map((project) => project?.id),
    );
  }

  public get currentEnvironmentId$() {
    return this.#environmentService.activeEnvironment$.pipe(
      map((environment) => environment?.id),
    );
  }

  // TODO: Use Public API
  public getAllFeaturesForCurrentProjectAndEnvironment() {
    return this.#http.get<FeatureResponse>(`${environment.api}/features`, {
      params: {
        projectId: environment.projectId,
        environmentId: environment.environmentId,
      },
      withCredentials: true,
    });
  }

  public getFeatures(args: {
    projectId: string;
    environmentId: string;
    sort?: SortBy<FeatureSortBy>;
    search?: string;
    pagination?: Pagination;
  }): Observable<FeatureResponse> {
    return this.#http.get<FeatureResponse>(`${environment.api}/features`, {
      params: {
        projectId: args.projectId,
        environmentId: args.environmentId,
        ...QueryParamUtil.buildSortParam(args?.sort),
        ...QueryParamUtil.buildSearchParam(args?.search),
        ...QueryParamUtil.buildPaginationParam(args?.pagination),
      },
      withCredentials: true,
    });
  }

  public getFeatureTypeSelectOptions(): SelectOption<FeatureValueType>[] {
    return Object.values(FeatureValueType).map((feature) => {
      return {
        label: startCase(feature),
        value: feature,
      };
    });
  }

  public createFeature(data: FeatureCreateData): Observable<Feature> {
    return this.#http
      .post<Feature>(`${environment.api}/features`, data, {
        withCredentials: true,
      })
      .pipe(tap(() => this.#refreshSubject.next()));
  }

  public updateFeature(
    id: string,
    data: Partial<FeatureUpdateData>,
  ): Observable<Feature> {
    return this.#http
      .post<Feature>(`${environment.api}/features/${id}`, data, {
        withCredentials: true,
      })
      .pipe(finalize(() => this.#refreshSubject.next()));
  }

  public deleteFeature(id: string): Observable<void> {
    return this.#http
      .delete<void>(`${environment.api}/features/${id}`, {
        withCredentials: true,
      })
      .pipe(tap(() => this.#refreshSubject.next()));
  }
}
