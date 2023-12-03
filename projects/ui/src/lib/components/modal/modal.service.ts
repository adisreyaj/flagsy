import { Dialog, DialogConfig, DialogRef } from '@angular/cdk/dialog';
import { inject, Injectable, Type } from '@angular/core';
import { omit } from 'lodash-es';
import { Observable } from 'rxjs';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { ModalComponent } from './modal.component';
import { ModalRef } from './modal.ref';
import {
  ConfirmationModalConfig,
  DIALOG_COMPONENT,
  DIALOG_CONFIG,
  ModalConfig,
  ModalDataType,
  ModalSize,
} from './modal.type';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  readonly #dialog = inject(Dialog);

  open<DataType = unknown, ReturnType = unknown>(
    component: Type<unknown>,
    config?: ModalConfig & { data?: DataType },
  ): DialogRef<ReturnType, ModalComponent> {
    return this.#dialog.open<ReturnType, DataType, ModalComponent>(
      ModalComponent,
      {
        ...this.getModalDimensions(config?.size),
        panelClass: 'modal',
        backdropClass: 'overlay-backdrop',
        providers: [
          {
            provide: DIALOG_COMPONENT,
            useValue: component,
          },
          {
            provide: DIALOG_CONFIG,
            useValue: omit(config, 'data'),
          },
          {
            provide: ModalRef,
            useExisting: DialogRef,
          },
        ],
        data: config?.data,
      },
    );
  }

  openConfirmation<TemplateContextData = unknown>(
    config: ConfirmationModalConfig<TemplateContextData>,
  ): Observable<boolean | undefined> {
    const ref: DialogRef<boolean, ModalComponent> = this.open<
      ConfirmationModalConfig<TemplateContextData>,
      boolean
    >(ConfirmationModalComponent, {
      size: config.size,
      title: config.title,
      dataType: ModalDataType.Warning,
      data: config,
    });

    return ref.closed;
  }

  private getModalDimensions(
    size?: ModalSize,
  ): Pick<DialogConfig, 'maxWidth' | 'width'> {
    switch (size) {
      case ModalSize.Small:
        return {
          width: '100%',
          maxWidth: '500px',
        };
      case ModalSize.Large:
        return {
          width: '100%',
          maxWidth: '900px',
        };
      default:
        return {
          width: '100%',
          maxWidth: '700px',
        };
    }
  }
}
