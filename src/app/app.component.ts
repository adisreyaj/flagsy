import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  template: ` <router-outlet></router-outlet>`,
  standalone: true,
  imports: [CommonModule, RouterOutlet],
})
export class AppComponent {}
