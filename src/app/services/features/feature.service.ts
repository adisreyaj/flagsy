import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { isNotUndefined } from '@app/types/common.type';
import { Environment } from '@app/types/environment.type';
import {
  Feature,
  FeatureCreateData,
  FeatureValueType,
} from '@app/types/feature.type';
import { startCase } from 'lodash-es';
import { filter, Observable, startWith, Subject, switchMap } from 'rxjs';
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

  getFeatures(): Signal<Feature[]> {
    return toSignal(
      this.#refreshSubject.pipe(
        startWith(undefined),
        switchMap(() =>
          toObservable(this.#environmentService.activeEnvironment),
        ),
        filter(isNotUndefined),
        switchMap((activeEnvironment: Environment) =>
          this.#http.get<Feature[]>(`${environment.api}/features`, {
            params: {
              environmentId: activeEnvironment.id,
            },
            withCredentials: true,
          }),
        ),
      ),
      {
        initialValue: [],
      },
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
    return this.#http.post<Feature>(`${environment.api}/features`, data, {
      withCredentials: true,
    });
  }
}
