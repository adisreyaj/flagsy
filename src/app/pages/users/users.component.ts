import { Component, inject } from '@angular/core';
import { UsersService } from '@app/services/users/users.service';
import {
  ButtonComponent,
  SheetService,
  TableColumnConfig,
  TableComponent,
  TableDataFetcher,
  TableDefaultCellType,
} from '@ui/components';
import { capitalize } from 'lodash-es';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { Permissions } from '../../config/permission.config';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';
import { UserInviteSheetComponent } from '../../shared/components/user-invite-sheet/user-invite-sheet.component';
import { PermissionAccessDirective } from '../../shared/directives/persmission-access.directive';

@Component({
  selector: 'app-users',
  template: ` <div class="flex flex-col h-full w-full">
    <app-page-header class="flex-grow-0">
      <div
        class="flex gap-2 items-center"
        *permissionAccess="this.inviteUserScope"
      >
        <ui-button
          label="Invite User"
          trailingIcon="add-line"
          (click)="this.openInviteUserSheet()"
        />
      </div>
    </app-page-header>

    <section class="flex-auto min-h-0 flex flex-col p-4 gap-4">
      <ui-table
        class="block h-full"
        [columns]="this.columns"
        [data]="this.dataFetcher"
        [pageable]="true"
      ></ui-table>
    </section>
  </div>`,
  standalone: true,
  imports: [
    PageHeaderComponent,
    ButtonComponent,
    PermissionAccessDirective,
    TableComponent,
  ],
})
export class UsersComponent {
  protected readonly inviteUserScope: string[] = [Permissions.user.write];

  protected readonly columns: TableColumnConfig[] = [
    {
      id: 'firstName',
      label: 'First Name',
      sortable: true,
      type: TableDefaultCellType.Text,
    },
    {
      id: 'lastName',
      label: 'Last Name',
      sortable: true,
      type: TableDefaultCellType.Text,
    },
    {
      id: 'email',
      label: 'Email',
      minWidthInPx: 150,
      type: TableDefaultCellType.Text,
    },
    {
      id: 'role',
      label: 'Role',
      minWidthInPx: 150,
      type: TableDefaultCellType.Text,
      transform: capitalize,
    },
  ];
  protected readonly dataFetcher: TableDataFetcher;

  readonly #usersService = inject(UsersService);
  readonly #sheetService = inject(SheetService);

  public constructor() {
    this.dataFetcher = () => this.#usersService.getAll();
  }

  protected openInviteUserSheet(): void {
    this.#sheetService.open(UserInviteSheetComponent, {
      title: 'Invite User',
      size: SheetSize.Medium,
    });
  }
}
