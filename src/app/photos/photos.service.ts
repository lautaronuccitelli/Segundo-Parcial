import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Photo } from '../models/Photo';

@Injectable({ providedIn: 'root' })
export class PhotosService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/photos';
  private cache = new BehaviorSubject<Photo[]>([]);
  data$ = this.cache.asObservable();

  constructor(private http: HttpClient) {}

  load() {
    this.http.get<Photo[]>(this.apiUrl).pipe(
      tap(data => {
        this.cache.next(data.slice(0, 10));
      })
    ).subscribe(() => {}, error => console.error("Error loading photos", error));
  }

  add(photo: Photo) {
    this.http.post<Photo>(this.apiUrl, photo).subscribe(res => {
      const newPhoto = { ...res, id: Math.max(...this.cache.value.map(p => p.id ? Number(p.id) : 0)) + 1 };
      this.cache.next([...this.cache.value, newPhoto]);
    },
    error => console.error("Error adding photo", error)
    );
  }

  update(photo: Photo) {
    this.http.put<Photo>(`${this.apiUrl}/${photo.id}`, photo).subscribe(() => {
      const updated = this.cache.value.map(p => p.id === photo.id ? photo : p);
      this.cache.next(updated);
    },
    error => console.error("Error updating photo", error)
    );
  }

  delete(id: number | string) {
    this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
      this.cache.next(this.cache.value.filter(p => p.id !== id));
    },
    error => console.error("Error deleting photo", error)
    );
  }
}