import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularRemixIconComponent } from 'angular-remix-icon';
import { NavigationEntry } from '../../../config/navigation-definition.data';

@Component({
  selector: `app-page-header`,
  template: `
    <header
      class="flex items-center justify-between gap-4 p-4 border-b h-[80px]"
    >
      <div class="flex gap-3 items-center">
        @if (this.routeData?.icon !== undefined) {
          <div class="rounded-xl p-2 text-primary-600 bg-slate-100">
            <rmx-icon [name]="this.routeData!.icon"></rmx-icon>
          </div>
        }
        <div class="font-bold text-2xl text-gray-800">
          {{ this.title ?? this.routeData?.title ?? '' }}
        </div>
      </div>
      <div>
        <ng-content></ng-content>
      </div>
    </header>
  `,
  standalone: true,
  imports: [AngularRemixIconComponent],
})
export class PageHeaderComponent {
  @Input() public title = undefined;

  #activatedRoute = inject(ActivatedRoute);

  public get routeData(): NavigationEntry | undefined {
    return this.#activatedRoute.snapshot.data as NavigationEntry | undefined;
  }
}
