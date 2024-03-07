import { Component } from '@angular/core';

@Component({
  selector: `ui-spinner`,
  template: `<div class="loader"></div>`,
  standalone: true,
  styles: [
    //language=scss
    `
      .loader {
        width: 28px;
        padding: 6px;
        aspect-ratio: 1;
        border-radius: 50%;
        background: #25b09b;
        --gradient: conic-gradient(#0000 10%, #000),
          linear-gradient(#000 0 0) content-box;
        -webkit-mask: var(--gradient);
        mask: var(--gradient);
        -webkit-mask-composite: source-out;
        mask-composite: subtract;
        animation: spin 1s infinite linear;
      }
      @keyframes spin {
        to {
          transform: rotate(1turn);
        }
      }
    `,
  ],
})
export class SpinnerComponent {}
