import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, Observable, of, tap } from 'rxjs';

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
  private selectedParkSubject = new BehaviorSubject<Park | null>(null);

  parks$ = this.parksSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();
  selectedPark$ = this.selectedParkSubject.asObservable();

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

  fetchById(id: string): Observable<Park> {
    if (this.selectedParkSubject.value?.id === id) {
      return of(this.selectedParkSubject.value);
    }

    return this.http.get<Park>(`${this.url}/${id}`).pipe(
      tap(park => this.selectedParkSubject.next(park))
    );
  }

  setSelectedPark(park: Park) {
    this.selectedParkSubject.next(park);
  }
}
