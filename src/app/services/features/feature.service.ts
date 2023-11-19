import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  Feature,
  FeatureCreateData,
  FeatureValueType,
} from '@app/types/feature.type';
import { startCase } from 'lodash-es';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SelectOption } from '../../shared/components/select.type';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  private readonly http = inject(HttpClient);

  getFeatures(): Observable<Feature[]> {
    return this.http.get<Feature[]>(`${environment.api}/features`, {
      withCredentials: true,
    });
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
    return this.http.post<Feature>(`${environment.api}/features`, data, {
      withCredentials: true,
    });
  }
}
