import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProjectsService } from '@app/services/projects/projects.service';
import {
  FormFieldComponent,
  SelectComponent,
  SelectOptionComponent,
} from '@ui/components';

@Component({
  selector: 'app-project-selector',
  template: ` <ui-select
    class="block bg-white w-full"
    [ngModel]="this.activeProject()?.id"
    (ngModelChange)="this.updateActiveProject($event)"
  >
    @for (option of this.projectSelectOptions(); track option.value) {
      <ui-select-option
        [label]="option.label"
        [value]="option.value"
      ></ui-select-option>
    }
  </ui-select>`,
  standalone: true,
  imports: [
    FormFieldComponent,
    SelectComponent,
    SelectOptionComponent,
    FormsModule,
  ],
})
export class ProjectSelectorComponent {
  protected readonly projectSelectOptions;
  protected readonly activeProject;

  readonly #projectsService = inject(ProjectsService);

  public constructor() {
    this.projectSelectOptions = this.#projectsService.getProjectSelectOptions();
    this.activeProject = this.#projectsService.activeProject;
  }

  public updateActiveProject(projectId: string): void {
    this.#projectsService.setActiveProject(projectId);
  }
}
