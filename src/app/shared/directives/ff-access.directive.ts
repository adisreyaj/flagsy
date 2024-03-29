import {
  Directive,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AccessService } from '@app/services/access/access.service';

@Directive({
  selector: '[ffAccess]',
  standalone: true,
})
export class FfAccessDirective {
  readonly #templateRef = inject(TemplateRef);
  readonly #viewContainer = inject(ViewContainerRef);
  readonly #accessService = inject(AccessService);

  @Input()
  public set ffAccess(featureFlag: string) {
    if (this.#accessService.hasAccess(featureFlag)) {
      this.#viewContainer.createEmbeddedView(this.#templateRef);
    } else {
      this.#viewContainer.clear();
    }
  }
}
