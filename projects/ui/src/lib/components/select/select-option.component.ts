import { Component, input } from '@angular/core';

@Component({
  selector: 'ui-select-option',
  template: ``,
  standalone: true,
})
export class SelectOptionComponent<ValueType = unknown> {
  public value = input.required<ValueType>();

  public label = input.required<string>();

  public disabled = input<boolean>(false);
}
