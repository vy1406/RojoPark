import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private readonly apiUrl = 'https://6vdl1qb46k.execute-api.us-east-1.amazonaws.com/prod';

  constructor(private http: HttpClient) { }

  getPresignedUrl(username: string, fileType: string): Observable<string> {
    const fileName = `${username}.profile`;
    return this.http.post<{ uploadUrl: string }>(`${this.apiUrl}/get-presigned-url`, { fileName, fileType }).pipe(
      switchMap((response) => of(response.uploadUrl))
    );
  }

  uploadFileToS3(uploadUrl: string, file: File): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': file.type });
    return this.http.put(uploadUrl, file, { headers, observe: 'response' });
  }
}
