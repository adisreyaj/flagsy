import { AsyncPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProjectsService } from '@app/services/projects/projects.service';
import { ButtonComponent, InputComponent, SheetService } from '@ui/components';
import { SheetSize } from '../../../../projects/ui/src/lib/components/sheet/sheet.type';
import { EnvironmentSelectorComponent } from '../../shared/components/environment-selector/environment-selector.component';
import { PageHeaderComponent } from '../../shared/components/header/page-header.component';
import { ProjectConfigSheetComponent } from '../../shared/components/project-config-sheet/project-config-sheet.component';

@Component({
  selector: 'app-projects',
  template: `
    <div class="flex flex-col h-full">
      <app-page-header>
        <div class="flex gap-2 items-center">
          <ui-button
            label="Create"
            trailingIcon="add-line"
            (click)="this.openProjectConfigSheet()"
          ></ui-button>
        </div>
      </app-page-header>
      <section class="page-content">
        <ul class="flex gap-4">
          @for (project of this.projects | async; track project.id) {
            <li
              class="flex p-4 rounded-xl border border-gray-300 cursor-pointer"
            >
              <a>
                {{ project.name }}
              </a>
            </li>
          }
        </ul>
      </section>
    </div>
  `,
  standalone: true,
  imports: [
    ButtonComponent,
    PageHeaderComponent,
    FormsModule,
    RouterLink,
    InputComponent,
    AsyncPipe,
    EnvironmentSelectorComponent,
  ],
})
export class ProjectsComponent {
  protected readonly projects;
  protected readonly searchText = signal('');

  private readonly sheetService = inject(SheetService);
  private readonly projectsService = inject(ProjectsService);

  constructor() {
    this.projects = this.projectsService.getAllProjects();
  }

  public openProjectConfigSheet(): void {
    this.sheetService.open(ProjectConfigSheetComponent, {
      title: 'Create Project',
      size: SheetSize.Medium,
    });
  }
}
