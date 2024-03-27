import { AsyncPipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnvironmentsService } from '@app/services/environments/environments.service';
import {
  FormFieldComponent,
  SelectComponent,
  SelectOptionComponent,
} from '@ui/components';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-environment-selector',
  template: `
    @if (this.environmentSelectOptions().length > 0) {
      <ui-select
        class="block bg-white w-full"
        [ngModel]="activeEnvironmentId$ | async"
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
    AsyncPipe,
  ],
})
export class EnvironmentSelectorComponent {
  public readonly environmentSelect = output<string>();

  protected readonly environmentSelectOptions;

  protected readonly activeEnvironmentId$: Observable<string | undefined>;

  readonly #environmentsService = inject(EnvironmentsService);

  public constructor() {
    this.activeEnvironmentId$ =
      this.#environmentsService.activeEnvironment$.pipe(
        map((environment) => environment?.id),
      );

    this.environmentSelectOptions =
      this.#environmentsService.getEnvironmentSelectOptions();
  }

  protected updateActiveEnvironment(environmentId: string): void {
    this.#environmentsService.setActiveEnvironment(environmentId);
    this.environmentSelect.emit(environmentId);
  }
}
