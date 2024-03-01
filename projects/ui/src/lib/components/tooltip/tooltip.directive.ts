import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { TooltipComponent } from './tooltip.component';

@Directive({ selector: '[uiTooltip]', standalone: true })
export class TooltipDirective {
  text = input<string | undefined>('', {
    alias: 'uiTooltip',
  });

  position = input<string | undefined>(undefined, {
    alias: 'uiTooltipPosition',
  });

  offsetX = input<number | undefined>(undefined, {
    alias: 'uiTooltipOffsetX',
  });

  offsetY = input<number | undefined>(undefined, {
    alias: 'uiTooltipOffsetY',
  });

  #overlayRef?: OverlayRef;
  #overlay = inject(Overlay);
  #overlayPositionBuilder = inject(OverlayPositionBuilder);
  #elementRef = inject(ElementRef);
  #positionStrategy?: FlexibleConnectedPositionStrategy;

  constructor() {
    this.#positionStrategy = this.#overlayPositionBuilder
      .flexibleConnectedTo(this.#elementRef)
      .withPositions(
        [
          PopoverPosition.AboveCentered,
          PopoverPosition.RightCentered,
          PopoverPosition.BelowCentered,
          PopoverPosition.LeftCentered,
          PopoverPosition.AboveLeftAligned,
          PopoverPosition.AboveRightAligned,
          PopoverPosition.BelowLeftAligned,
          PopoverPosition.BelowRightAligned,
          PopoverPosition.OverLeftAligned,
          PopoverPosition.InsideTopLeft,
        ].map((pos) => this.getPositionPairForLocation(pos)),
      );

    this.#overlayRef = this.#overlay.create({
      positionStrategy: this.#positionStrategy,
    });

    effect(() => {
      if (this.position() !== undefined) {
        this.#positionStrategy?.withPositions([
          this.getPositionPairForLocation(
            this.position() as PopoverPosition,
            this.offsetX(),
            this.offsetY(),
          ),
        ]);
      }
    });
  }

  @HostListener('mouseenter')
  @HostListener('focusin')
  show() {
    const tooltipRef = this.#overlayRef?.attach(
      new ComponentPortal(TooltipComponent),
    );
    if (tooltipRef !== undefined) {
      tooltipRef.instance.text.set(this.text());
    }
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  hide() {
    this.#overlayRef?.detach();
  }

  private getPositionPairForLocation(
    location: PopoverPosition,
    offsetX: number | undefined = undefined,
    offsetY: number | undefined = undefined,
  ): ConnectionPositionPair {
    switch (location) {
      case PopoverPosition.AboveLeftAligned:
        return new ConnectionPositionPair(
          { originX: 'start', originY: 'top' },
          { overlayX: 'start', overlayY: 'bottom' },
          offsetX,
          offsetY,
        );

      case PopoverPosition.AboveRightAligned:
        return new ConnectionPositionPair(
          { originX: 'end', originY: 'top' },
          { overlayX: 'end', overlayY: 'bottom' },
          offsetX,
          offsetY,
        );

      case PopoverPosition.BelowCentered:
        return new ConnectionPositionPair(
          { originX: 'center', originY: 'bottom' },
          { overlayX: 'center', overlayY: 'top' },
          offsetX ?? 0,
          offsetY ?? 5,
        );

      case PopoverPosition.BelowLeftAligned:
        return new ConnectionPositionPair(
          { originX: 'start', originY: 'bottom' },
          { overlayX: 'start', overlayY: 'top' },
          offsetX,
          offsetY,
        );

      case PopoverPosition.BelowRightAligned:
        return new ConnectionPositionPair(
          { originX: 'end', originY: 'bottom' },
          { overlayX: 'end', overlayY: 'top' },
          offsetX,
          offsetY,
        );

      case PopoverPosition.LeftCentered:
        return new ConnectionPositionPair(
          { originX: 'start', originY: 'center' },
          { overlayX: 'end', overlayY: 'center' },
          offsetX ?? -5,
          offsetY,
        );

      case PopoverPosition.OverLeftAligned:
        return new ConnectionPositionPair(
          { originX: 'start', originY: 'top' },
          { overlayX: 'start', overlayY: 'top' },
          offsetX,
          offsetY,
        );

      case PopoverPosition.RightCentered:
        return new ConnectionPositionPair(
          { originX: 'end', originY: 'center' },
          { overlayX: 'start', overlayY: 'center' },
          offsetX ?? 5,
          offsetY,
        );

      case PopoverPosition.InsideTopLeft:
        return new ConnectionPositionPair(
          { originX: 'start', originY: 'top' },
          { overlayX: 'start', overlayY: 'top' },
          offsetX,
          offsetY,
        );

      default:
        return new ConnectionPositionPair(
          { originX: 'center', originY: 'top' },
          { overlayX: 'center', overlayY: 'bottom' },
          offsetX ?? 0,
          offsetY ?? -5,
        );
    }
  }
}

export enum PopoverPosition {
  AboveCentered = 'above-centered',
  BelowCentered = 'below-centered',
  BelowRightAligned = 'below-right-aligned',
  BelowLeftAligned = 'below-left-aligned',
  AboveRightAligned = 'above-right-aligned',
  AboveLeftAligned = 'above-left-aligned',
  LeftCentered = 'left-centered',
  OverLeftAligned = 'over-left-aligned',
  RightCentered = 'right-centered',
  InsideTopLeft = 'inside-top-left',
}
