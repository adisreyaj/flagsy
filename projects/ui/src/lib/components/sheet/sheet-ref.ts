import { OverlayRef } from '@angular/cdk/overlay';

export class SheetRef {
  #overlayRef?: OverlayRef;

  public setRef(overlayRef: OverlayRef) {
    this.#overlayRef = overlayRef;
  }

  public close() {
    this.#overlayRef?.dispose();
  }
}
