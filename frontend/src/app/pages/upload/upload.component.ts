import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Add Documents</h1>
        <p>Supplement the knowledge base with your own documents — upload an employment contract, offer letter, or any relevant correspondence.</p>
      </div>

      <div class="cards">
        <!-- PDF Upload -->
        <mat-card class="upload-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon class="title-icon pdf-icon">picture_as_pdf</mat-icon>
              Upload PDF
            </mat-card-title>
            <mat-card-subtitle>Index a PDF document</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <div
              class="drop-zone"
              [class.has-file]="selectedFile"
              [class.drag-over]="isDragOver"
              (click)="fileInput.click()"
              (dragover)="onDragOver($event)"
              (dragleave)="isDragOver = false"
              (drop)="onDrop($event)"
            >
              <mat-icon class="drop-icon">
                {{ selectedFile ? 'description' : 'cloud_upload' }}
              </mat-icon>
              <p *ngIf="!selectedFile">
                Drag &amp; drop a PDF, or <span class="link-text">browse</span>
              </p>
              <p *ngIf="selectedFile" class="file-name">{{ selectedFile.name }}</p>
              <small *ngIf="selectedFile" class="file-size">
                {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
              </small>
              <input #fileInput type="file" accept=".pdf" hidden (change)="onFileSelected($event)" />
            </div>
          </mat-card-content>

          <mat-card-actions align="end">
            <button mat-button *ngIf="selectedFile && !uploading" (click)="clearFile()">
              Clear
            </button>
            <button
              mat-flat-button
              color="primary"
              [disabled]="!selectedFile || uploading"
              (click)="uploadPdf()"
            >
              <mat-spinner *ngIf="uploading && uploadType === 'pdf'" diameter="18" class="btn-spinner"></mat-spinner>
              <mat-icon *ngIf="!uploading || uploadType !== 'pdf'">upload</mat-icon>
              {{ uploading && uploadType === 'pdf' ? 'Uploading...' : 'Upload PDF' }}
            </button>
          </mat-card-actions>
        </mat-card>

        <!-- URL Scrape -->
        <mat-card class="upload-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon class="title-icon url-icon">language</mat-icon>
              Scrape URL
            </mat-card-title>
            <mat-card-subtitle>Index a web page</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <mat-form-field appearance="outline" class="url-field">
              <mat-label>Web page URL</mat-label>
              <mat-icon matPrefix>link</mat-icon>
              <input
                matInput
                [(ngModel)]="url"
                placeholder="https://example.com/docs/article"
                type="url"
              />
            </mat-form-field>
          </mat-card-content>

          <mat-card-actions align="end">
            <button
              mat-flat-button
              color="primary"
              [disabled]="!url.trim() || uploading"
              (click)="uploadUrl()"
            >
              <mat-spinner *ngIf="uploading && uploadType === 'url'" diameter="18" class="btn-spinner"></mat-spinner>
              <mat-icon *ngIf="!uploading || uploadType !== 'url'">add_link</mat-icon>
              {{ uploading && uploadType === 'url' ? 'Scraping...' : 'Add URL' }}
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page {
      padding: 36px 32px;
      max-width: 1000px;
    }

    .page-header { margin-bottom: 32px; }

    .page-header h1 {
      margin: 0 0 8px;
      font-size: 28px;
      font-weight: 500;
      color: #1a1a2e;
    }

    .page-header p {
      margin: 0;
      color: #777;
      font-size: 15px;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
      gap: 24px;
    }

    .upload-card {
      border-radius: 14px !important;
      box-shadow: 0 2px 14px rgba(0,0,0,.07) !important;
    }

    .title-icon {
      vertical-align: middle;
      margin-right: 8px;
      font-size: 22px;
      width: 22px;
      height: 22px;
    }

    .pdf-icon  { color: #e91e63; }
    .url-icon  { color: #1976d2; }

    .drop-zone {
      border: 2px dashed #ddd;
      border-radius: 10px;
      padding: 36px 20px;
      text-align: center;
      cursor: pointer;
      transition: border-color .2s, background .2s;
      margin-top: 8px;
    }

    .drop-zone:hover, .drop-zone.drag-over {
      border-color: #5c6bc0;
      background: rgba(92,107,192,.04);
    }

    .drop-zone.has-file {
      border-color: #4caf50;
      background: rgba(76,175,80,.04);
    }

    .drop-icon {
      font-size: 42px;
      width: 42px;
      height: 42px;
      color: #ccc;
      margin-bottom: 10px;
      display: block;
      margin: 0 auto 10px;
    }

    .drop-zone.has-file .drop-icon { color: #4caf50; }

    .drop-zone p {
      margin: 0 0 4px;
      color: #999;
      font-size: 14px;
    }

    .file-name {
      font-weight: 500;
      color: #333 !important;
    }

    .file-size {
      color: #aaa;
      font-size: 12px;
    }

    .link-text {
      color: #5c6bc0;
      font-weight: 500;
    }

    .url-field {
      width: 100%;
      margin-top: 8px;
    }

    .btn-spinner {
      display: inline-block;
      margin-right: 8px;
    }

    mat-card-actions {
      padding: 8px 16px 16px !important;
    }
  `],
})
export class UploadComponent {
  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);

  selectedFile: File | null = null;
  url = '';
  uploading = false;
  uploadType: 'pdf' | 'url' | null = null;
  isDragOver = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.selectedFile = input.files[0];
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const file = event.dataTransfer?.files[0];
    if (file?.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.snackBar.open('Please drop a PDF file.', 'OK', { duration: 3000 });
    }
  }

  clearFile(): void {
    this.selectedFile = null;
  }

  uploadPdf(): void {
    if (!this.selectedFile) return;
    this.uploading = true;
    this.uploadType = 'pdf';

    this.api.uploadPdf(this.selectedFile).subscribe({
      next: (res) => {
        this.snackBar.open(
          `Indexed "${res.source}" — ${res.chunks} chunks`,
          'Close',
          { duration: 4000, panelClass: 'success-snack' },
        );
        this.selectedFile = null;
      },
      error: (err) => {
        this.snackBar.open(
          err.error?.detail ?? 'Upload failed.',
          'Close',
          { duration: 5000, panelClass: 'error-snack' },
        );
      },
      complete: () => {
        this.uploading = false;
        this.uploadType = null;
      },
    });
  }

  uploadUrl(): void {
    if (!this.url.trim()) return;
    this.uploading = true;
    this.uploadType = 'url';

    this.api.uploadUrl(this.url).subscribe({
      next: (res) => {
        this.snackBar.open(
          `Indexed "${res.source}" — ${res.chunks} chunks`,
          'Close',
          { duration: 4000, panelClass: 'success-snack' },
        );
        this.url = '';
      },
      error: (err) => {
        this.snackBar.open(
          err.error?.detail ?? 'Failed to scrape URL.',
          'Close',
          { duration: 5000, panelClass: 'error-snack' },
        );
      },
      complete: () => {
        this.uploading = false;
        this.uploadType = null;
      },
    });
  }
}
