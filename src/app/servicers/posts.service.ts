import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, map, tap } from 'rxjs';

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
  parkId?: string;
  moderator?: User;
  comments?: Comment[];
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private readonly url = 'http://localhost:3000/posts'

  private allPostSubject = new BehaviorSubject<Post[]>([]);
  private parkPostsSubject = new BehaviorSubject<Post[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  allPosts$ = this.allPostSubject.asObservable();
  parkPosts$ = this.parkPostsSubject.asObservable();
  loading$ = this.loadingSubject.asObservable();

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
    this.loadingSubject.next(true);
    this.http.get<Post[]>(`${this.url}?parkId=${parkId}`)
      .pipe(
        delay(2000),
        tap(parkPosts => {
          console.log('Fetched posts for park:', parkPosts);
          this.parkPostsSubject.next(parkPosts);
          this.loadingSubject.next(false);
        })
      )
      .subscribe();
  }
}
