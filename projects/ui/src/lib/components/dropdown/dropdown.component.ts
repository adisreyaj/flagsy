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
  isOpen = signal(false);

  content = contentChild(DropdownContentDirective);

  contentTemplate: Signal<TemplateRef<unknown> | null> = computed(
    () => this.content()?.template ?? null,
  );

  public toggleVisibility(): void {
    if (!this.isOpen()) this.isOpen.set(!this.isOpen());
  }

  public closeOnEscape(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.isOpen.set(false);
    }
  }

  public toggleVisibilityOnKeyDown(event: KeyboardEvent): void {
    if (['Enter', 'Space', 'ArrowDown', 'ArrowUp'].includes(event.key)) {
      this.toggleVisibility();
    }
  }

  public close() {
    this.isOpen.set(false);
  }
}

@Directive({
  selector: '[uiDropdownContent]',
  standalone: true,
})
export class DropdownContentDirective {
  constructor(public template?: TemplateRef<unknown>) {}
}
