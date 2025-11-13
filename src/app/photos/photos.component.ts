import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PhotosService } from './photos.service';
import { Photo } from '../models/Photo';

@Component({
  selector: 'app-photos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.css']
})
export class PhotosComponent implements OnInit {
  list: Photo[] = [];
  showModal = false;
  editItem: Photo | null = null;

  temp: Photo = { id: '', albumId: 0, title: '', url: '', thumbnailUrl: '' };
  
  newItem: Photo = { albumId: 1, title: '', url: 'https://via.placeholder.com/600', thumbnailUrl: 'https://via.placeholder.com/150' };

  constructor(private srv: PhotosService) {}

  ngOnInit() {
    this.srv.load();
    this.srv.data$.subscribe(d => {
      this.list = d;
    });
  }

  openModal(item: Photo) {
    this.editItem = item;
    this.temp = { ...item };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editItem = null;
  }
  
  add() {
    if (!this.validate(this.newItem)) return;

    this.srv.add(this.newItem);
    this.newItem = { albumId: 1, title: '', url: 'https://via.placeholder.com/600', thumbnailUrl: 'https://via.placeholder.com/150' };
  }

  save() {
    if (!this.editItem) return;

    if (!this.validate(this.temp)) return;

    this.srv.update(this.temp);
    this.closeModal();
  }

  validate(p: Photo): boolean {
    if (!p.title.trim()) {
      alert("El titulo es obligatorio");
      return false;
    }
    if (p.albumId <= 0 || !Number.isInteger(p.albumId)) {
      alert("El ID de album es invalido");
      return false;
    }
    if (!/^https?:\/\/.+/.test(p.url)) {
      alert("La URL completa es invalida");
      return false;
    }
    if (!/^https?:\/\/.+/.test(p.thumbnailUrl)) {
      alert("La URL en miniatura es invalida");
      return false;
    }
    return true;
  }

  delete(id: number | string) {
    this.srv.delete(id);
  }
}