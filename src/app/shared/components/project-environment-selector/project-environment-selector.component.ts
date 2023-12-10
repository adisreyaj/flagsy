import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
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
  template: `<fieldset
    class="grid gap-2 items-center grid-cols-[1fr,16px,1fr] w-96"
  >
    <ui-select
      class="block bg-white w-full"
      prefixIcon="briefcase-line"
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
          name="arrow-right-line"
        ></rmx-icon>
      </div>
      <ui-select
        class="block bg-white w-full"
        prefixIcon="archive-drawer-line"
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
  @Output()
  environmentSelect = new EventEmitter<string>();

  protected readonly projectSelectOptions;
  protected readonly environmentSelectOptions;

  protected readonly activeEnvironment;

  private readonly projectsService = inject(ProjectsService);
  private readonly environmentsService = inject(EnvironmentsService);

  protected readonly activeProject;

  constructor() {
    this.activeProject = this.projectsService.activeProject;
    this.projectSelectOptions = this.projectsService.getProjectSelectOptions();

    this.activeEnvironment = this.environmentsService.activeEnvironment;
    this.environmentSelectOptions =
      this.environmentsService.getEnvironmentSelectOptions();
  }

  public updateActiveProject(projectId: string): void {
    this.projectsService.setActiveProject(projectId);
  }

  public updateActiveEnvironment(environmentId: string): void {
    this.environmentsService.setActiveEnvironment(environmentId);
    this.environmentSelect.emit(environmentId);
  }
}
