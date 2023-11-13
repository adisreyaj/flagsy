import { OverlayRef } from '@angular/cdk/overlay';

export class SheetRef {
  private overlayRef?: OverlayRef;

  setRef(overlayRef: OverlayRef) {
    this.overlayRef = overlayRef;
  }

  close() {
    this.overlayRef?.dispose();
  }
}
