import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayPositionBuilder,
  OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  ComponentRef,
  Directive,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { delay, Subject, takeUntil, tap } from 'rxjs';
import { TooltipComponent } from './tooltip.component';

@Directive({ selector: '[uiTooltip]', standalone: true })
export class TooltipDirective {
  public text = input<string | undefined>('', {
    alias: 'uiTooltip',
  });

  public position = input<string | undefined>(undefined, {
    alias: 'uiTooltipPosition',
  });

  public offsetX = input<number | undefined>(undefined, {
    alias: 'uiTooltipOffsetX',
  });

  public offsetY = input<number | undefined>(undefined, {
    alias: 'uiTooltipOffsetY',
  });

  #overlayRef?: OverlayRef;
  #tooltipRef?: ComponentRef<TooltipComponent>;

  readonly #mouseEnter$: Subject<void> = new Subject();
  readonly #mouseLeave$: Subject<void> = new Subject();

  readonly #overlay = inject(Overlay);
  readonly #overlayPositionBuilder = inject(OverlayPositionBuilder);
  readonly #elementRef = inject(ElementRef);
  readonly #positionStrategy: FlexibleConnectedPositionStrategy;

  public constructor() {
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
        ].map((pos) => this.#getPositionPairForLocation(pos)),
      );

    this.#overlayRef = this.#overlay.create({
      positionStrategy: this.#positionStrategy,
    });

    effect(() => {
      if (this.position() !== undefined) {
        this.#positionStrategy?.withPositions([
          this.#getPositionPairForLocation(
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
  public show() {
    this.#mouseEnter$
      .pipe(
        delay(200),
        takeUntil(this.#mouseLeave$),
        tap({
          complete: () => this.#removeTooltip(),
        }),
      )
      .subscribe(() => {
        this.#showTooltip();
      });

    this.#mouseEnter$.next();
  }

  @HostListener('mouseleave')
  @HostListener('focusout')
  public hide() {
    this.#mouseLeave$.next();
  }

  #getPositionPairForLocation(
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

  #showTooltip(): void {
    this.#overlayRef?.detach();
    this.#tooltipRef = this.#overlayRef?.attach(
      new ComponentPortal(TooltipComponent),
    );
    this.#tooltipRef?.instance.text.set(this.text());
  }

  #removeTooltip(): void {
    this.#overlayRef?.detach();
    this.#tooltipRef?.destroy();
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
