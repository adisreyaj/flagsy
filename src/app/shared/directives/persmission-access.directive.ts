import {
  Directive,
  inject,
  Input,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { AccessService } from '@app/services/access/access.service';

@Directive({
  selector: '[permissionAccess]',
  standalone: true,
})
export class PermissionAccessDirective {
  readonly #templateRef = inject(TemplateRef);
  readonly #viewContainer = inject(ViewContainerRef);
  readonly #accessService = inject(AccessService);

  @Input() set permissionAccess(scopes: string[] | string) {
    if (
      this.#accessService.hasPermission(
        Array.isArray(scopes) ? scopes : [scopes],
      )
    ) {
      this.#viewContainer.createEmbeddedView(this.#templateRef);
    } else {
      this.#viewContainer.clear();
    }
  }
}
