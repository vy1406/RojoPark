import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, tap } from 'rxjs';

export interface Park {
  id: number;
  name: string;
  location: string;
}
@Injectable({
  providedIn: 'root'
})
export class ParkService {
  private readonly url = 'http://localhost:3000/parks'
  private parksSubject = new BehaviorSubject<Park[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  parks$ = this.parksSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  fetchParks() {
    this.loadingSubject.next(true);
    setTimeout(() => {
      this.http.get<Park[]>(this.url)
        .pipe(
          tap(parks => {
            this.parksSubject.next(parks);
            this.loadingSubject.next(false);
          })
        ).subscribe();
    }, 2000);
  }
}
