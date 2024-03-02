import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class FlagsyTitleStrategy extends TitleStrategy {
  #title = inject(Title);

  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    this.#title.setTitle(
      title
        ? `${title} | Flagsy - Feature Flag Management`
        : 'Flagsy - Feature Flag Management',
    );
  }
}
