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
  private readonly url = 'https://jsonplaceholder.typicode.com/users'
  private randomLocations = ['North Park', 'South Valley', 'East Meadow', 'West Hills', 'Central Park', 'Downtown Park', 'Uptown']
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
          map(parks => parks.map(user => ({
            id: user.id,
            name: user.name,
            location: this.randomLocations[Math.floor(Math.random() * this.randomLocations.length)]
          }))),
          tap(parks => {
            this.parksSubject.next(parks);
            this.loadingSubject.next(false);
          })
        ).subscribe();
    }, 2000);
  }
}
