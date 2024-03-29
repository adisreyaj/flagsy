import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  selector: 'ui-tooltip',
  template: `
    @if (this.text(); as text) {
      <div
        class="bg-slate-800 rounded-md shadow-xl text-white px-2 py-1 text-sm"
        @tooltip
      >
        {{ text }}
      </div>
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tooltip', [
      transition(':enter', [
        style({ opacity: 0, scale: 0.9 }),
        animate(
          '300ms cubic-bezier(.4,.89,.65,1.04)',
          style({ opacity: 1, scale: 1 }),
        ),
      ]),
      transition(':leave', [animate(200, style({ opacity: 0, scale: 0 }))]),
    ]),
  ],
})
export class TooltipComponent {
  protected text = signal<string | undefined>(undefined);
}
