import { inject, Injectable } from '@angular/core';
import { Feature } from '@app/types/feature.type';
import { tap } from 'rxjs';
import { FeatureFlag } from '../../config/feature.config';
import { FeatureService } from '../features/feature.service';

@Injectable({
  providedIn: 'root',
})
export class AccessService {
  readonly #featureService = inject(FeatureService);
  #features = new Map<string, Feature>();

  constructor() {
    this.init();
  }

  public init() {
    return this.#featureService
      .getAllFeaturesForCurrentProjectAndEnvironment()
      .pipe(
        tap((features) => {
          this.#features = new Map(features.map((f) => [f.key, f]));
        }),
      );
  }

  hasAccess(
    featureKey?: FeatureFlag | string | FeatureFlag[] | string[],
  ): boolean {
    if (!featureKey) {
      return true;
    }

    if (Array.isArray(featureKey)) {
      return featureKey.every((key) => this.hasAccess(key));
    }

    const featureData = this.#features.get(featureKey);

    return featureData?.value === true;
  }
}
