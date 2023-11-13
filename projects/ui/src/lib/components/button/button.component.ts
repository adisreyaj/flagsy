import {
  booleanAttribute,
  Component,
  computed,
  Input,
  signal,
} from '@angular/core';

@Component({
  selector: 'ui-button',
  template: `
    <button [class]="this.buttonClasses()" [disabled]="this.isDisabled()">
      {{ this.label }}
    </button>
  `,
  styleUrl: './button.component.scss',
  standalone: true,
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

  protected readonly isDisabled = signal(false);
  private readonly sizeSelection = signal('md');
  private readonly variantSelection = signal('primary');

  protected readonly buttonClasses = computed(() => {
    return ['btn', this.sizeSelection(), this.variantSelection()];
  });
}

export type ButtonVariant = 'primary' | 'neutral';
export type ButtonSize = 'sm' | 'md' | 'lg';
