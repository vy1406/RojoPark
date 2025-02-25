import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, delay, map, tap } from 'rxjs';
import { Park } from './parks.service';

export interface User {
  id: string;
  username: string;
}

export interface Comment {
  id: string;
  content: string;
  commentator: User;
  date: string;
}

export interface Post {
  id: string;
  dateCreated?: string;
  title: string;
  thumbnailSmall?: string;
  thumbnailLarge?: string;
  attachments?: string[];
  content?: string;
  park?: Park;
  moderator?: User;
  comments?: Comment[];
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly url = 'http://localhost:3000/posts'

  private allPostSubject = new BehaviorSubject<Post[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  allPosts$ = this.allPostSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

  parkPosts = signal<Post[]>([]);
  loading = signal<boolean>(false);

  constructor(private http: HttpClient) { }

  fetchAllPosts() {
    this.loadingSubject.next(true);
    this.http.get<Post[]>(this.url)
      .pipe(
        delay(2000),
        tap(posts => {
          this.allPostSubject.next(posts);
          this.loadingSubject.next(false);
        })
      )
      .subscribe();
  }

  fetchPostById(id: string) {
    return this.http.get<Post>(`${this.url}/${id}`).pipe(delay(2000));
  }

  fetchByParkId(parkId: string) {
    this.loading.set(true);
    this.http.get<Post[]>(`${this.url}?parkId=${parkId}`)
      .pipe(
        delay(2000),
        tap(posts => {
          this.parkPosts.set(posts);
          this.loading.set(false);
        })
      )
      .subscribe();
  }
}
