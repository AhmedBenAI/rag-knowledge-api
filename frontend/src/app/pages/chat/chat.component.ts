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

const EXAMPLE_QUESTIONS = [
  'Can my employer change my contract without my consent?',
  'How much notice am I entitled to when made redundant?',
  'What counts as unfair dismissal?',
  'Am I entitled to paid holiday if I work part-time?',
];

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
          <mat-icon>gavel</mat-icon>
        </div>
        <div>
          <h2>Ask a Question</h2>
          <span class="subheading">Answers grounded in GOV.UK &amp; ACAS guidance</span>
        </div>
        <button
          mat-stroked-button
          class="clear-btn"
          *ngIf="messages.length"
          (click)="clearChat()"
        >
          <mat-icon>delete_sweep</mat-icon> Clear
        </button>
      </div>

      <!-- Messages -->
      <div class="messages" #messageList>
        <div *ngIf="messages.length === 0" class="empty-state">
          <mat-icon>balance</mat-icon>
          <h3>UK employment law, explained clearly</h3>
          <p>Try one of these common questions:</p>
          <div class="example-questions">
            <button
              *ngFor="let q of examples"
              class="example-btn"
              (click)="askExample(q)"
            >{{ q }}</button>
          </div>
        </div>

        <div
          *ngFor="let msg of messages"
          class="message-row"
          [class.user-row]="msg.role === 'user'"
        >
          <div class="avatar" *ngIf="msg.role === 'assistant'">
            <mat-icon>gavel</mat-icon>
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
            <mat-icon>gavel</mat-icon>
          </div>
          <div class="bubble assistant-bubble loading-bubble">
            <mat-spinner diameter="18"></mat-spinner>
            <span>Researching…</span>
          </div>
        </div>
      </div>

      <!-- Input -->
      <div class="input-bar">
        <mat-form-field appearance="outline" class="input-field">
          <input
            matInput
            [(ngModel)]="question"
            placeholder="Ask about your employment rights…"
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
      background: #fdecea;
      border-radius: 10px;
      padding: 10px;
      display: flex;
      align-items: center;
    }

    .header-icon mat-icon {
      color: #c0392b;
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
      gap: 10px;
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
      font-size: 16px;
    }

    .empty-state p {
      margin: 0;
      font-size: 13px;
    }

    .example-questions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 4px;
      width: 100%;
      max-width: 480px;
    }

    .example-btn {
      background: #fff;
      border: 1px solid #e0e0e8;
      border-radius: 8px;
      padding: 10px 16px;
      font-size: 13px;
      color: #444;
      cursor: pointer;
      text-align: left;
      transition: border-color .15s, background .15s;
      font-family: inherit;
    }

    .example-btn:hover {
      border-color: #c0392b;
      background: #fdecea;
      color: #c0392b;
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
      background: #fdecea;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .avatar mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #c0392b;
    }

    .user-avatar { background: #e3f2fd; }
    .user-avatar mat-icon { color: #1976d2; }

    /* ─── Bubbles ─── */
    .bubble {
      max-width: 68%;
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
      background: #1a2332;
      color: #fff;
      border-bottom-right-radius: 4px;
    }

    .bubble-text {
      margin: 0;
      font-size: 14px;
      line-height: 1.7;
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

  readonly examples = EXAMPLE_QUESTIONS;
  messages: Message[] = [];
  question = '';
  loading = false;
  private needsScroll = false;

  ngAfterViewChecked(): void {
    if (this.needsScroll) {
      this.scrollToBottom();
      this.needsScroll = false;
    }
  }

  askExample(q: string): void {
    this.question = q;
    this.send();
  }

  send(): void {
    const q = this.question.trim();
    if (!q || this.loading) return;

    this.messages.push({ role: 'user', content: q });
    this.question = '';
    this.loading = true;
    this.needsScroll = true;

    this.api.ask(q).subscribe({
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
