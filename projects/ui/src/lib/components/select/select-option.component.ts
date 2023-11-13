import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-select-option',
  template: ``,
  standalone: true,
})
export class SelectOptionComponent<ValueType = unknown> {
  @Input({ required: true })
  public value!: ValueType;

  @Input({ required: true })
  public label!: string;

  @Input()
  public disabled: boolean = false;
}
