import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import {
  FormFieldComponent,
  SelectComponent,
  SelectOptionComponent,
} from '@ui/components';

@Component({
  selector: 'app-environment-selector',
  template: `
    @if (this.environmentSelectOptions().length > 1) {
      <ui-select
        class="block bg-white w-full"
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
  `,
  standalone: true,
  imports: [
    FormFieldComponent,
    SelectComponent,
    SelectOptionComponent,
    FormsModule,
  ],
})
export class EnvironmentSelectorComponent {
  protected readonly environmentSelectOptions;
  private readonly environmentsService = inject(EnvironmentsService);

  protected readonly activeEnvironment;

  constructor() {
    this.activeEnvironment = this.environmentsService.activeEnvironment;
    this.environmentSelectOptions =
      this.environmentsService.getEnvironmentSelectOptions();
  }

  public updateActiveEnvironment(environmentId: string): void {
    this.environmentsService.setActiveEnvironment(environmentId);
  }
}
