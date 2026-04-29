import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AskResponse, UploadResponse } from '../models/types';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = '/api';
  readonly userId = 'uk_employment_law';

  uploadPdf(file: File): Observable<UploadResponse> {
    const form = new FormData();
    form.append('user_id', this.userId);
    form.append('file', file);
    return this.http.post<UploadResponse>(`${this.base}/upload/pdf`, form);
  }

  uploadUrl(url: string): Observable<UploadResponse> {
    return this.http.post<UploadResponse>(`${this.base}/upload/url`, {
      user_id: this.userId,
      url,
    });
  }

  ask(question: string): Observable<AskResponse> {
    return this.http.post<AskResponse>(`${this.base}/ask`, {
      user_id: this.userId,
      question,
    });
  }
}
