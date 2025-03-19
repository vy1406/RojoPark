import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private diceBearUrl = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=';

  constructor(private http: HttpClient) { }

  generateRandomAvatar(): Observable<string> {
    const randomSeed = Math.random().toString(36).substring(7);
    return this.http.get(`${this.diceBearUrl}${randomSeed}`, { responseType: 'text' });
  }
}
