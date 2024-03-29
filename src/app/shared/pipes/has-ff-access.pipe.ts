import { inject, Pipe, PipeTransform } from '@angular/core';
import { AccessService } from '@app/services/access/access.service';

@Pipe({
  name: 'hasFFAccess',
  standalone: true,
  pure: false,
})
export class HasFFAccessPipe implements PipeTransform {
  #accessService = inject(AccessService);

  public transform(value: string) {
    return this.#accessService.hasAccess(value);
  }
}
