import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

export interface Park {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParkService {
  private readonly url = 'https://jsonplaceholder.typicode.com/users'
  private parksSubject = new BehaviorSubject<Park[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  parks$ = this.parksSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) { }

  fetchUsers() {
    this.loadingSubject.next(true);
    this.http.get<Park[]>(this.url)
      .pipe(
        tap(parks => {
          this.parksSubject.next(parks);
          this.loadingSubject.next(false);
        })
      ).subscribe();
  }
}
