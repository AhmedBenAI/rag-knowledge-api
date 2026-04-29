import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  template: `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-icon-wrap">
            <mat-icon>gavel</mat-icon>
          </div>
          <div class="brand-text">
            <span class="brand-name">UK Law Assistant</span>
            <span class="brand-tagline">Employment Law Q&amp;A</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a class="nav-item" routerLink="/chat" routerLinkActive="nav-active">
            <mat-icon>chat_bubble_outline</mat-icon>
            <span>Ask a Question</span>
          </a>
          <a class="nav-item" routerLink="/upload" routerLinkActive="nav-active">
            <mat-icon>upload_file</mat-icon>
            <span>Add Documents</span>
          </a>
        </nav>

        <div class="sidebar-sources">
          <p class="sources-label">Knowledge base</p>
          <ul>
            <li>GOV.UK employment rights</li>
            <li>ACAS guidelines</li>
            <li>Your uploaded documents</li>
          </ul>
        </div>

        <div class="sidebar-footer">
          <mat-icon>info_outline</mat-icon>
          <span>Not legal advice</span>
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
      width: 240px;
      min-width: 240px;
      background: #1a2332;
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
      background: #c0392b;
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

    .sidebar-nav {
      padding: 16px 12px 0;
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
      background: rgba(192,57,43,.25);
      color: #e88;
    }

    .nav-item.nav-active mat-icon { color: #e88; }

    .sidebar-sources {
      flex: 1;
      padding: 20px 20px 0;
    }

    .sources-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: .8px;
      color: rgba(255,255,255,.3);
      margin: 0 0 8px;
    }

    .sidebar-sources ul {
      margin: 0;
      padding: 0 0 0 14px;
      color: rgba(255,255,255,.45);
      font-size: 12px;
      line-height: 1.9;
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
export class AppComponent {}
