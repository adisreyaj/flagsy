import { Component, computed, input } from '@angular/core';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { IconName } from 'angular-remix-icon/lib/icon-names';

@Component({
  selector: 'ui-button',
  template: `
    <button [class]="this.buttonClasses()" [disabled]="this.disabled()">
      @if (this.prefixIcon(); as prefixIcon) {
        <div>
          <rmx-icon
            class="button-icon prefix-icon"
            [name]="prefixIcon"
          ></rmx-icon>
        </div>
      }
      @if (this.label()) {
        <div class="label">
          {{ this.label() }}
        </div>
      }
      @if (this.trailingIcon(); as trailingIcon) {
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
  public label = input<string | number>('');
  public variant = input<ButtonVariant>('primary');
  public size = input<ButtonSize>('md');
  public disabled = input<boolean>(false);
  public trailingIcon = input<IconName>();
  public prefixIcon = input<IconName>();
  public contentAlignment = input<ButtonContentAlignment>('center');

  protected readonly buttonClasses = computed(() => {
    return [
      'btn',
      this.size(),
      this.variant(),
      this.trailingIcon() ? 'has-trailing-icon' : '',
      this.prefixIcon() ? 'has-prefix-icon' : '',
      this.#getContentAlignmentClass(),
    ];
  });

  #getContentAlignmentClass(): string {
    switch (this.contentAlignment()) {
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
export type ButtonContentAlignment = 'left' | 'center' | 'right';
