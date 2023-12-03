import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { inject, Injectable, Injector, Type } from '@angular/core';
import { SheetRef } from './sheet-ref';
import {
  SHEET_COMPONENT_ARGS,
  SheetComponent,
  SheetComponentArgs,
} from './sheet.component';
import { SHEET_DATA, SheetConfig, SheetSize } from './sheet.type';

@Injectable({
  providedIn: 'root',
})
export class SheetService {
  private readonly overlay = inject(Overlay);
  private readonly parentInjector = inject(Injector);

  open<DataType = unknown>(
    component: Type<unknown>,
    config?: SheetConfig<DataType>,
  ) {
    const sheetConfig: SheetComponentArgs<DataType> = {
      content: component,
      title: config?.title,
    };

    const sheetRef = new SheetRef();
    const injector = Injector.create({
      providers: [
        {
          provide: SHEET_COMPONENT_ARGS,
          useValue: sheetConfig,
        },
        {
          provide: SHEET_DATA,
          useValue: config?.data,
        },
        {
          provide: SheetRef,
          useValue: sheetRef,
        },
      ],
      parent: this.parentInjector,
    });
    const componentPortal = new ComponentPortal(
      SheetComponent,
      undefined,
      injector,
    );
    const positionStrategy = this.overlay
      .position()
      .global()
      .top('0')
      .right('0');

    const overlayConfig: OverlayConfig = {
      ...this.getSheetDimensions(config?.size),
      hasBackdrop: true,
      backdropClass: 'overlay-backdrop',
      panelClass: 'sheet',
      disposeOnNavigation: true,
      positionStrategy: positionStrategy,
    };
    const ref = this.overlay.create(overlayConfig);
    sheetRef.setRef(ref);
    return ref.attach(componentPortal);
  }

  private getSheetDimensions(
    size?: SheetSize,
  ): Pick<OverlayConfig, 'maxWidth' | 'height' | 'width'> {
    switch (size) {
      case SheetSize.Small:
        return {
          height: '100vh',
          width: '100%',
          maxWidth: '400px',
        };
      case SheetSize.Large:
        return {
          height: '100vh',
          width: '100%',
          maxWidth: '900px',
        };
      default:
        return {
          height: '100vh',
          width: '100%',
          maxWidth: '800px',
        };
    }
  }
}
