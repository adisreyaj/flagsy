import { AsyncPipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import { ProjectsService } from '@app/services/projects/projects.service';
import {
  FormFieldComponent,
  SelectComponent,
  SelectOptionComponent,
} from '@ui/components';
import { AngularRemixIconComponent } from 'angular-remix-icon';

@Component({
  selector: 'app-project-environment-selector',
  template: `<fieldset class="flex flex-col gap-2 items-center">
    <ui-select
      class="block bg-white w-full"
      prefixIcon="briefcase-line"
      placeholder="Select project"
      [ngModel]="this.activeProject()?.id"
      (ngModelChange)="this.updateActiveProject($event)"
    >
      @for (option of this.projectSelectOptions(); track option.value) {
        <ui-select-option
          [label]="option.label"
          [value]="option.value"
        ></ui-select-option>
      }
    </ui-select>
    @if (this.environmentSelectOptions().length > 0) {
      <div>
        <rmx-icon
          class="!w-4 !h-4 text-gray-500"
          name="arrow-down-line"
        ></rmx-icon>
      </div>
      <ui-select
        class="block bg-white w-full"
        prefixIcon="archive-drawer-line"
        placeholder="Select environment"
        [ngModel]="this.activeEnvironment()?.id"
        (ngModelChange)="this.updateActiveEnvironment($event)"
      >
        @for (option of this.environmentSelectOptions(); track option.value) {
          <ui-select-option
            [label]="option.label"
            [value]="option.value"
          ></ui-select-option>
        }
      </ui-select>
    }
  </fieldset>`,
  standalone: true,
  imports: [
    FormFieldComponent,
    SelectComponent,
    SelectOptionComponent,
    FormsModule,
    AsyncPipe,
    AngularRemixIconComponent,
  ],
})
export class ProjectEnvironmentSelectorComponent {
  public readonly environmentSelect = output<string>();

  protected readonly projectSelectOptions;
  protected readonly environmentSelectOptions;
  protected readonly activeEnvironment;
  protected readonly activeProject;

  readonly #projectsService = inject(ProjectsService);
  readonly #environmentsService = inject(EnvironmentsService);

  public constructor() {
    this.projectSelectOptions = this.#projectsService.getProjectSelectOptions();
    this.environmentSelectOptions =
      this.#environmentsService.getEnvironmentSelectOptions();

    this.activeProject = this.#projectsService.activeProject;
    this.activeEnvironment = this.#environmentsService.activeEnvironment;
  }

  protected updateActiveProject(projectId: string): void {
    this.#projectsService.setActiveProject(projectId);
  }

  protected updateActiveEnvironment(environmentId: string): void {
    this.#environmentsService.setActiveEnvironment(environmentId);
    this.environmentSelect.emit(environmentId);
  }
}
