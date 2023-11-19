import {
  booleanAttribute,
  Component,
  computed,
  Input,
  signal,
} from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { IconName } from 'angular-remix-icon/lib/icon-names';

@Component({
  selector: 'ui-button',
  template: `
    <button [class]="this.buttonClasses()" [disabled]="this.isDisabled()">
      <div>
        {{ this.label }}
      </div>
      @if (this.trailingIcon; as icon) {
        <div>
          <rmx-icon class="trailing-icon" [name]="icon"></rmx-icon>
        </div>
      }
    </button>
  `,
  styleUrl: './button.component.scss',
  standalone: true,
  imports: [AngularRemixIconComponent],
})
export class ButtonComponent {
  @Input()
  public label: string = '';

  @Input()
  public set variant(variant: ButtonVariant) {
    this.variantSelection.set(variant);
  }

  @Input()
  public set size(size: ButtonSize) {
    this.sizeSelection.set(size);
  }

  @Input({ transform: booleanAttribute })
  public set disabled(isDisabled: boolean) {
    this.isDisabled.set(isDisabled);
  }

  @Input()
  public trailingIcon?: IconName;

  protected readonly isDisabled = signal(false);
  private readonly sizeSelection = signal('md');
  private readonly variantSelection = signal('primary');

  protected readonly buttonClasses = computed(() => {
    return [
      'btn',
      this.sizeSelection(),
      this.variantSelection(),
      this.trailingIcon ? 'has-trailing-icon' : '',
    ];
  });
}

export type ButtonVariant = 'primary' | 'neutral';
export type ButtonSize = 'sm' | 'md' | 'lg';
