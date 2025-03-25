import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AvatarService {
  private diceBearUrl = 'https://api.dicebear.com/7.x/pixel-art/svg?seed=';
  private profileBucketUrl = `https://rojo-park-img-storage.s3.us-east-1.amazonaws.com/profiles`
  constructor(private http: HttpClient) { }

  generateRandomAvatar(): Observable<string> {
    const randomSeed = Math.random().toString(36).substring(7);
    return this.http.get(`${this.diceBearUrl}${randomSeed}`, { responseType: 'text' });
  }

  getProfilePictureUrl(username: string): string {
    return `${this.profileBucketUrl}/${username}.profile`;
  }
}
