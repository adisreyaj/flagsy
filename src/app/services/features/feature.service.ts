import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SortBy } from '@app/types/common.type';
import {
  Feature,
  FeatureCreateData,
  FeatureResponse,
  FeatureSortBy,
  FeatureUpdateData,
  FeatureValueType,
} from '@app/types/feature.type';
import { startCase } from 'lodash-es';
import { combineLatest, Observable, Subject, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SelectOption } from '../../shared/components/select.type';
import { QueryParamUtil } from '../../utils/query-param.util';
import { EnvironmentsService } from '../environments/environments.service';
import { ProjectsService } from '../projects/projects.service';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  #refreshSubject = new Subject<void>();
  #http = inject(HttpClient);
  #environmentService = inject(EnvironmentsService);
  #projectsService = inject(ProjectsService);

  getAllFeaturesForCurrentProjectAndEnvironment() {
    return this.#http.get<FeatureResponse>(`${environment.api}/features`, {
      params: {
        projectId: environment.projectId,
        environmentId: environment.environmentId,
      },
      withCredentials: true,
    });
  }

  getFeatures(args?: {
    sort?: SortBy<FeatureSortBy>;
    search?: string;
  }): Observable<FeatureResponse> {
    return combineLatest([
      this.#projectsService.activeProject$,
      this.#environmentService.activeEnvironment$,
    ]).pipe(
      switchMap(([activeProject, activeEnvironment]) =>
        this.#http.get<FeatureResponse>(`${environment.api}/features`, {
          params: {
            projectId: activeProject.id,
            environmentId: activeEnvironment.id,
            ...QueryParamUtil.buildSortParam(args?.sort),
          },
          withCredentials: true,
        }),
      ),
    );
  }

  getFeatureTypeSelectOptions(): SelectOption<FeatureValueType>[] {
    return Object.values(FeatureValueType).map((feature) => {
      return {
        label: startCase(feature),
        value: feature,
      };
    });
  }

  createFeature(data: FeatureCreateData): Observable<Feature> {
    return this.#http
      .post<Feature>(`${environment.api}/features`, data, {
        withCredentials: true,
      })
      .pipe(tap(() => this.#refreshSubject.next()));
  }

  updateFeature(
    id: string,
    data: Partial<FeatureUpdateData>,
  ): Observable<Feature> {
    return this.#http
      .post<Feature>(`${environment.api}/features/${id}`, data, {
        withCredentials: true,
      })
      .pipe(tap(() => this.#refreshSubject.next()));
  }

  deleteFeature(id: string): Observable<void> {
    return this.#http
      .delete<void>(`${environment.api}/features/${id}`, {
        withCredentials: true,
      })
      .pipe(tap(() => this.#refreshSubject.next()));
  }
}
