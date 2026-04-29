import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AskResponse, UploadResponse } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api';

  uploadPdf(userId: string, file: File): Observable<UploadResponse> {
    const form = new FormData();
    form.append('user_id', userId);
    form.append('file', file);
    return this.http.post<UploadResponse>(`${this.base}/upload/pdf`, form);
  }

  uploadUrl(userId: string, url: string): Observable<UploadResponse> {
    return this.http.post<UploadResponse>(`${this.base}/upload/url`, {
      user_id: userId,
      url,
    });
  }

  ask(userId: string, question: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.base}/ask`, {
      user_id: userId,
      question,
    });
  }
}
