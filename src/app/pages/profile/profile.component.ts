import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  template: `
    <div class="flex flex-col items-center justify-center h-full">
      <h1 class="text-3xl font-bold">Profile</h1>
      <p class="text-xl">This is your profile page.</p>
    </div>
  `,
  standalone: true,
})
export class ProfileComponent {}
