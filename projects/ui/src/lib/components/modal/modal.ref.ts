import { DialogRef } from '@angular/cdk/dialog';
import { inject } from '@angular/core';

export class ModalRef<ReturnValue = unknown> extends DialogRef<ReturnValue> {
  #dialogRef: DialogRef<ReturnValue> = inject(DialogRef);

  public override close(data?: ReturnValue) {
    this.#dialogRef.close(data);
  }
}
