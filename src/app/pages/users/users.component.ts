import { Component } from '@angular/core';
import { ButtonComponent } from '@ui/components';
import { Permissions } from '../../config/permission.config';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';
import { PermissionAccessDirective } from '../../shared/directives/persmission-access.directive';

@Component({
  selector: 'app-users',
  template: ` <div class="flex flex-col h-full w-full">
    <app-page-header class="flex-grow-0">
      <div
        class="flex gap-2 items-center"
        *permissionAccess="this.inviteUserScope"
      >
        <ui-button label="Invite User" trailingIcon="add-line"></ui-button>
      </div>
    </app-page-header>

    <section class="flex-auto min-h-0 flex flex-col p-4 gap-4"></section>
  </div>`,
  standalone: true,
  imports: [PageHeaderComponent, ButtonComponent, PermissionAccessDirective],
})
export class UsersComponent {
  protected readonly inviteUserScope: string[] = [Permissions.user.write];
}
