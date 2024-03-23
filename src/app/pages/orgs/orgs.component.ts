import { Component, inject } from '@angular/core';
import { OrgsService } from '@app/services/orgs/orgs.service';
import {
  FilterBarComponent,
  TableColumnConfig,
  TableComponent,
  TableDataFetcher,
  TableDefaultCellType,
} from '@ui/components';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';

@Component({
  selector: 'app-orgs',
  template: ` <div class="flex flex-col h-full w-full">
    <app-page-header class="flex-grow-0"></app-page-header>

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
  imports: [FilterBarComponent, PageHeaderComponent, TableComponent],
})
export class OrgsComponent {
  protected readonly columns: TableColumnConfig[] = [
    {
      id: 'name',
      label: 'Name',
      sortable: true,
      type: TableDefaultCellType.TextWithCopy,
    },
    {
      id: 'count.members',
      label: 'Members',
      width: 15,
      minWidthInPx: 150,
      type: TableDefaultCellType.Text,
    },
    {
      id: 'count.projects',
      label: 'Projects',
      width: 15,
      minWidthInPx: 150,
      type: TableDefaultCellType.Text,
    },
    {
      id: 'count.environments',
      label: 'Environments',
      width: 15,
      minWidthInPx: 150,
      type: TableDefaultCellType.Text,
    },
    {
      id: 'count.features',
      label: 'Features',
      width: 15,
      minWidthInPx: 150,
      type: TableDefaultCellType.Text,
    },
  ];
  protected readonly dataFetcher: TableDataFetcher;

  readonly #orgsService = inject(OrgsService);

  constructor() {
    this.dataFetcher = () => this.#orgsService.getAll();
  }
}
