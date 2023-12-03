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
      @if (this.prefixIcon; as prefix) {
        <div>
          <rmx-icon class="button-icon prefix-icon" [name]="prefix"></rmx-icon>
        </div>
      }
      @if (this.label) {
        <div class="label">
          {{ this.label }}
        </div>
      }
      @if (this.trailingIcon; as trailingIcon) {
        <div>
          <rmx-icon
            class="button-icon trailing-icon"
            [name]="trailingIcon"
          ></rmx-icon>
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

  @Input()
  public prefixIcon?: IconName;

  @Input()
  public contentAlignment?: 'left' | 'center' | 'right' = 'center';

  protected readonly isDisabled = signal(false);
  private readonly sizeSelection = signal('md');
  private readonly variantSelection = signal('primary');

  protected readonly buttonClasses = computed(() => {
    return [
      'btn',
      this.sizeSelection(),
      this.variantSelection(),
      this.trailingIcon ? 'has-trailing-icon' : '',
      this.prefixIcon ? 'has-prefix-icon' : '',
      this.getContentAlignmentClass(),
    ];
  });

  private getContentAlignmentClass(): string {
    switch (this.contentAlignment) {
      case 'left':
        return 'content-left';
      case 'right':
        return 'content-right';
      default:
        return 'content-center';
    }
  }
}

export type ButtonVariant =
  | 'primary'
  | 'neutral'
  | 'icon'
  | 'plain'
  | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';
