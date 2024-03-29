import { computed, inject, Injectable } from '@angular/core';
import { Feature } from '@app/types/feature.type';
import { map, tap } from 'rxjs';
import { FeatureFlag } from '../../config/feature.config';
import { AuthService } from '../auth/auth.service';
import { FeatureService } from '../features/feature.service';

@Injectable({
  providedIn: 'root',
})
export class AccessService {
  readonly #featureService = inject(FeatureService);
  #features = new Map<string, Feature>();

  readonly #authService = inject(AuthService);
  readonly #scopesSet = computed(() => {
    return new Set(this.#authService.account()?.scopes ?? []);
  });

  readonly #roles = computed(() => {
    return this.#authService.account()?.role;
  });

  public constructor() {
    this.init();
  }

  public init() {
    return this.#featureService
      .getAllFeaturesForCurrentProjectAndEnvironment()
      .pipe(
        map((features) => features?.data ?? []),
        tap((features) => {
          this.#features = new Map(features.map((f) => [f.key, f]));
        }),
      );
  }

  public hasAccess(
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

  public hasPermission(scopes: string[]): boolean {
    return scopes.every((scope) => this.#scopesSet().has(scope));
  }
}
