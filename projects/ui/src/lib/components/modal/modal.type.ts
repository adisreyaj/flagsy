import { InjectionToken, TemplateRef, Type } from '@angular/core';
import { ButtonVariant } from '../button/button.component';

export interface ModalConfig {
  title?: string;
  size?: ModalSize;
  dataType?: ModalDataType;
}

export interface ConfirmationModalConfig<TemplateContextData = unknown> {
  title: string;
  content: string | TemplateRef<TemplateContextData>;
  context?: TemplateContextData;
  confirmButtonText?: string;
  confirmButtonVariant?: ButtonVariant;
  cancelButtonText?: string;
  size?: ModalSize;
  dataType?: ModalDataType;
}

export const enum ModalSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  ExtraLarge = 'extra-large',
}

export const DIALOG_COMPONENT = new InjectionToken<Type<unknown>>(
  'Content Component',
);

export const DIALOG_CONFIG = new InjectionToken<ModalConfig>('Dialog Config');

export const CONFIRMATION_MODAL_DATA =
  new InjectionToken<ConfirmationModalConfig>('Confirmation Modal Data');

export const enum ModalDataType {
  None = 'none',
  Info = 'info',
  Warning = 'warning',
  Danger = 'danger',
}
