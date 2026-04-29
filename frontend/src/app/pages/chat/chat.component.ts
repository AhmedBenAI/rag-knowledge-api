import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';
import { Message } from '../../models/types';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  template: `
    <div class="chat-page">
      <!-- Header -->
      <div class="chat-header">
        <div class="header-icon">
          <mat-icon>smart_toy</mat-icon>
        </div>
        <div>
          <h2>Ask AI</h2>
          <span class="subheading">Answers grounded in your knowledge base</span>
        </div>
        <button
          mat-stroked-button
          class="clear-btn"
          *ngIf="messages.length"
          (click)="clearChat()"
        >
          <mat-icon>delete_sweep</mat-icon> Clear chat
        </button>
      </div>

      <!-- Messages -->
      <div class="messages" #messageList>
        <div *ngIf="messages.length === 0" class="empty-state">
          <mat-icon>forum</mat-icon>
          <h3>Ask anything</h3>
          <p>Upload documents first, then ask questions about them.</p>
        </div>

        <div
          *ngFor="let msg of messages"
          class="message-row"
          [class.user-row]="msg.role === 'user'"
        >
          <div class="avatar" *ngIf="msg.role === 'assistant'">
            <mat-icon>smart_toy</mat-icon>
          </div>

          <div
            class="bubble"
            [class.user-bubble]="msg.role === 'user'"
            [class.assistant-bubble]="msg.role === 'assistant'"
          >
            <p class="bubble-text">{{ msg.content }}</p>

            <div *ngIf="msg.sources?.length" class="sources">
              <span class="sources-label">Sources</span>
              <mat-chip-set>
                <mat-chip *ngFor="let src of msg.sources">{{ src }}</mat-chip>
              </mat-chip-set>
            </div>
          </div>

          <div class="avatar user-avatar" *ngIf="msg.role === 'user'">
            <mat-icon>person</mat-icon>
          </div>
        </div>

        <!-- Loading indicator -->
        <div class="message-row" *ngIf="loading">
          <div class="avatar">
            <mat-icon>smart_toy</mat-icon>
          </div>
          <div class="bubble assistant-bubble loading-bubble">
            <mat-spinner diameter="18"></mat-spinner>
            <span>Thinking…</span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="input-bar">
        <mat-form-field appearance="outline" class="input-field">
          <input
            matInput
            [(ngModel)]="question"
            placeholder="Ask a question about your documents…"
            (keyup.enter)="send()"
            [disabled]="loading"
          />
        </mat-form-field>
        <button
          mat-fab
          color="primary"
          [disabled]="!question.trim() || loading"
          (click)="send()"
          aria-label="Send"
        >
          <mat-icon>send</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .chat-page {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    /* ─── Header ─── */
    .chat-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px 28px;
      background: #fff;
      border-bottom: 1px solid #e8e8f0;
      flex-shrink: 0;
    }

    .header-icon {
      background: #ede7f6;
      border-radius: 10px;
      padding: 10px;
      display: flex;
      align-items: center;
    }

    .header-icon mat-icon {
      color: #5c6bc0;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .chat-header h2 {
      margin: 0 0 2px;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .subheading {
      font-size: 13px;
      color: #aaa;
    }

    .clear-btn {
      margin-left: auto;
      color: #888;
    }

    /* ─── Messages ─── */
    .messages {
      flex: 1;
      overflow-y: auto;
      padding: 24px 28px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #bbb;
      text-align: center;
      gap: 8px;
      padding-bottom: 60px;
    }

    .empty-state mat-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #ddd;
    }

    .empty-state h3 {
      margin: 0;
      font-weight: 500;
      color: #aaa;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }

    .message-row {
      display: flex;
      align-items: flex-end;
      gap: 10px;
    }

    .user-row { flex-direction: row-reverse; }

    .avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #ede7f6;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #5c6bc0;
    }

    .user-avatar { background: #e3f2fd; }
    .user-avatar mat-icon { color: #1976d2; }

    /* ─── Bubbles ─── */
    .bubble {
      max-width: 66%;
      border-radius: 14px;
      padding: 12px 16px;
    }

    .assistant-bubble {
      background: #fff;
      border: 1px solid #e8e8f0;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 5px rgba(0,0,0,.06);
    }

    .user-bubble {
      background: #5c6bc0;
      color: #fff;
      border-bottom-right-radius: 4px;
    }

    .bubble-text {
      margin: 0;
      font-size: 14px;
      line-height: 1.65;
      white-space: pre-wrap;
    }

    .user-bubble .bubble-text { color: #fff; }

    .loading-bubble {
      display: flex;
      align-items: center;
      gap: 10px;
      color: #aaa;
      font-size: 14px;
    }

    /* ─── Sources ─── */
    .sources {
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #eee;
    }

    .sources-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .5px;
      color: #bbb;
      font-weight: 600;
      display: block;
      margin-bottom: 6px;
    }

    /* ─── Input bar ─── */
    .input-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 28px;
      background: #fff;
      border-top: 1px solid #e8e8f0;
      flex-shrink: 0;
    }

    .input-field { flex: 1; }
  `],
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('messageList') private messageList!: ElementRef<HTMLDivElement>;

  private readonly api = inject(ApiService);
  private readonly snackBar = inject(MatSnackBar);

  messages: Message[] = [];
  question = '';
  loading = false;
  private needsScroll = false;

  private get userId(): string {
    return localStorage.getItem('rag_user_id') ?? 'user_1';
  }

  ngAfterViewChecked(): void {
    if (this.needsScroll) {
      this.scrollToBottom();
      this.needsScroll = false;
    }
  }

  send(): void {
    const q = this.question.trim();
    if (!q || this.loading) return;

    this.messages.push({ role: 'user', content: q });
    this.question = '';
    this.loading = true;
    this.needsScroll = true;

    this.api.ask(this.userId, q).subscribe({
      next: (res) => {
        this.messages.push({
          role: 'assistant',
          content: res.answer,
          sources: res.sources,
        });
        this.needsScroll = true;
      },
      error: (err) => {
        const detail = err.error?.detail ?? 'Something went wrong.';
        this.messages.push({ role: 'assistant', content: `Error: ${detail}` });
        this.needsScroll = true;
        this.snackBar.open(detail, 'Close', {
          duration: 5000,
          panelClass: 'error-snack',
        });
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  clearChat(): void {
    this.messages = [];
  }

  private scrollToBottom(): void {
    try {
      const el = this.messageList.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch { /* noop */ }
  }
}
