import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="bar">
      <a routerLink="/" class="brand">Swad<span>opedia</span></a>
      <p class="tag">An atlas of India's regional kitchens</p>
    </header>
  `,
  styles: [`
    .bar {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      background: var(--navy);
      color: var(--paper);
    }
    .brand {
      font-family: var(--font-display);
      font-size: 1.5rem;
      text-decoration: none;
      color: var(--paper);
      letter-spacing: 0.01em;
    }
    .brand span { color: var(--marigold); }
    .tag {
      font-size: 0.8rem;
      color: var(--paper);
      opacity: 0.75;
      margin: 0;
    }
    @media (max-width: 560px) {
      .tag { display: none; }
    }
  `]
})
export class NavComponent {}
