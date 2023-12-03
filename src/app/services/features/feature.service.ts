import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { isNotUndefined } from '@app/types/common.type';
import { Environment } from '@app/types/environment.type';
import {
  Feature,
  FeatureCreateData,
  FeatureSortBy,
  FeatureUpdateData,
  FeatureValueType,
} from '@app/types/feature.type';
import { isEmpty, startCase } from 'lodash-es';
import { filter, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SelectOption } from '../../shared/components/select.type';
import { EnvironmentsService } from '../environments/environments.service';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  #refreshSubject = new Subject<void>();
  #http = inject(HttpClient);
  #environmentService = inject(EnvironmentsService);

  getFeatures({
    sort,
    search,
  }: {
    sort?: FeatureSortBy;
    search?: string;
  }): Observable<Feature[]> {
    return this.#refreshSubject.pipe(
      startWith(undefined),
      switchMap(() => this.#environmentService.activeEnvironment$),
      filter(isNotUndefined),
      switchMap((activeEnvironment: Environment) =>
        this.#http.get<Feature[]>(`${environment.api}/features`, {
          params: {
            environmentId: activeEnvironment.id,
            sortBy: sort ?? FeatureSortBy.Key,
            ...(!isEmpty(search?.trim()) ? { search } : {}),
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
}
