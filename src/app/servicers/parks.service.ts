import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, tap } from 'rxjs';

export interface Park {
  id: string;
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
    this.http.get<Park[]>(this.url)
      .pipe(
        delay(2000),
        tap(parks => {
          this.parksSubject.next(parks);
          this.loadingSubject.next(false);
        })
      ).subscribe();
  }

  fetchById(id: string) {

    return this.http.get<Park>(`${this.url}/${id}`).pipe(
      delay(2000))

  }
}
