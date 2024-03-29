import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  computed,
  contentChild,
  Directive,
  Signal,
  signal,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'ui-dropdown',
  template: ` <div
    #trigger="cdkOverlayOrigin"
    cdkOverlayOrigin
    (click)="this.toggleVisibility()"
    (keydown)="this.toggleVisibilityOnKeyDown($event)"
  >
    <ng-content></ng-content>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="trigger"
      [cdkConnectedOverlayOffsetY]="10"
      [cdkConnectedOverlayOpen]="this.isOpen()"
      (overlayOutsideClick)="this.isOpen.set(false)"
      (overlayKeydown)="this.closeOnEscape($event)"
    >
      <div
        cdkTrapFocus
        cdkTrapFocusAutoCapture
        class="rounded-xl bg-white shadow-xl border border-gray-200 min-w-[150px] p-2"
      >
        <ng-container *ngTemplateOutlet="this.contentTemplate()"></ng-container>
      </div>
    </ng-template>
  </div>`,
  standalone: true,
  imports: [
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    NgTemplateOutlet,
    CdkTrapFocus,
  ],
})
export class DropdownComponent {
  public isOpen = signal(false);

  protected content = contentChild(DropdownContentDirective);

  protected contentTemplate: Signal<TemplateRef<unknown> | null> = computed(
    () => this.content()?.template ?? null,
  );

  protected toggleVisibility(): void {
    if (!this.isOpen()) this.isOpen.set(!this.isOpen());
  }

  protected closeOnEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isOpen.set(false);
    }
  }

  protected toggleVisibilityOnKeyDown(event: KeyboardEvent): void {
    if (['Enter', 'Space', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      this.toggleVisibility();
    }
  }

  protected close() {
    this.isOpen.set(false);
  }
}

@Directive({
  selector: '[uiDropdownContent]',
  standalone: true,
})
export class DropdownContentDirective {
  public constructor(public template?: TemplateRef<unknown>) {}
}
