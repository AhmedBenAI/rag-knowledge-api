import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, FormsModule, MatIconModule],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-icon-wrap">
            <mat-icon>psychology</mat-icon>
          </div>
          <div class="brand-text">
            <span class="brand-name">RAG Knowledge</span>
            <span class="brand-tagline">AI Document Q&amp;A</span>
          </div>
        </div>

        <div class="user-section">
          <label class="input-label">Workspace / User ID</label>
          <div class="user-input-wrap">
            <mat-icon>person_outline</mat-icon>
            <input
              class="user-input"
              [(ngModel)]="userId"
              (ngModelChange)="saveUserId()"
              placeholder="user_1"
            />
          </div>
        </div>

        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/upload" routerLinkActive="nav-active">
            <mat-icon>upload_file</mat-icon>
            <span>Knowledge Base</span>
          </a>
          <a class="nav-item" routerLink="/chat" routerLinkActive="nav-active">
            <mat-icon>chat_bubble_outline</mat-icon>
            <span>Ask AI</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <mat-icon>auto_awesome</mat-icon>
          <span>Powered by GPT-3.5</span>
        </div>
      </aside>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-shell {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }

    .sidebar {
      width: 260px;
      min-width: 260px;
      background: #1e1f2e;
      color: #e0e0e0;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 16px rgba(0,0,0,.35);
      z-index: 10;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 24px 20px;
      border-bottom: 1px solid rgba(255,255,255,.08);
    }

    .brand-icon-wrap {
      background: #5c6bc0;
      border-radius: 10px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-icon-wrap mat-icon {
      color: #fff;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      letter-spacing: .3px;
    }

    .brand-tagline {
      font-size: 11px;
      color: rgba(255,255,255,.4);
    }

    .user-section {
      padding: 20px 16px 8px;
    }

    .input-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .8px;
      color: rgba(255,255,255,.35);
      display: block;
      margin-bottom: 6px;
    }

    .user-input-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,.07);
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 8px;
      padding: 9px 12px;
      transition: border-color .15s;
    }

    .user-input-wrap:focus-within {
      border-color: rgba(92,107,192,.7);
    }

    .user-input-wrap mat-icon {
      color: rgba(255,255,255,.4);
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .user-input {
      background: none;
      border: none;
      outline: none;
      color: rgba(255,255,255,.87);
      font-size: 14px;
      width: 100%;
      font-family: inherit;
    }

    .user-input::placeholder {
      color: rgba(255,255,255,.28);
    }

    .sidebar-nav {
      flex: 1;
      padding: 12px 12px 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 14px;
      border-radius: 8px;
      color: rgba(255,255,255,.6);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: background .15s, color .15s;
    }

    .nav-item mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .nav-item:hover {
      background: rgba(255,255,255,.07);
      color: rgba(255,255,255,.9);
    }

    .nav-item.nav-active {
      background: rgba(92,107,192,.25);
      color: #9fa8da;
    }

    .nav-item.nav-active mat-icon {
      color: #9fa8da;
    }

    .sidebar-footer {
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255,255,255,.22);
      font-size: 12px;
      border-top: 1px solid rgba(255,255,255,.06);
    }

    .sidebar-footer mat-icon {
      font-size: 15px;
      width: 15px;
      height: 15px;
    }

    .main-content {
      flex: 1;
      overflow: auto;
      background: #f5f6fa;
    }
  `],
})
export class AppComponent implements OnInit {
  userId = 'user_1';

  ngOnInit(): void {
    const saved = localStorage.getItem('rag_user_id');
    if (saved) this.userId = saved;
  }

  saveUserId(): void {
    localStorage.setItem('rag_user_id', this.userId);
  }
}
