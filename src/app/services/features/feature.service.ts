import { Injectable } from '@angular/core';
import { startCase } from 'lodash-es';
import { Observable, of } from 'rxjs';
import { SelectOption } from '../../shared/components/select.type';
import { Feature, FeatureValueType } from '../../types/feature';

@Injectable({
  providedIn: 'root',
})
export class FeatureService {
  getFeatures(): Observable<Feature[]> {
    return of([
      {
        id: '1',
        key: 'test',
        description: 'Test',
        value: {
          type: FeatureValueType.Boolean,
          value: true,
        },
        environmentOverrides: [],
        segmentOverrides: [],
        createdAt: new Date(),
        createdBy: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
        },
        archived: false,
      },
    ]);
  }

  getFeatureTypeSelectOptions(): SelectOption<FeatureValueType>[] {
    return Object.values(FeatureValueType).map((feature) => {
      return {
        label: startCase(feature),
        value: feature,
      };
    });
  }
}
