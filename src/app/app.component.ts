import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotosComponent } from './photos/photos.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, PhotosComponent],
  template: `<app-photos></app-photos>`,
})
export class AppComponent {}