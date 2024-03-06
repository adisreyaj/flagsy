import { Component, computed, input, Input } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { IconName } from 'angular-remix-icon/lib/icon-names';

@Component({
  selector: 'ui-button',
  template: `
    <button [class]="this.buttonClasses()" [disabled]="this.disabled()">
      @if (this.prefixIcon; as prefix) {
        <div>
          <rmx-icon class="button-icon prefix-icon" [name]="prefix"></rmx-icon>
        </div>
      }
      @if (this.label()) {
        <div class="label">
          {{ this.label() }}
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
  public label = input<string>('');

  public variant = input<ButtonVariant>('primary');

  public size = input<ButtonSize>('md');

  public disabled = input<boolean>(false);

  @Input()
  public trailingIcon?: IconName;

  @Input()
  public prefixIcon?: IconName;

  @Input()
  public contentAlignment?: 'left' | 'center' | 'right' = 'center';

  protected readonly buttonClasses = computed(() => {
    return [
      'btn',
      this.size(),
      this.variant(),
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
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
