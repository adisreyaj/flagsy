import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <ngx-loading-bar
      color="hsl(165, 84%, 39%)"
      height="3px"
      [includeSpinner]="false"
    ></ngx-loading-bar>
  `,
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoadingBarModule],
})
export class AppComponent {}
