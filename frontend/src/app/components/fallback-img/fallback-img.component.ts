import { Component, Input, OnChanges } from '@angular/core';
import { placeholderDataUrl } from '../../utils/placeholder-image';

@Component({
  selector: 'app-fallback-img',
  standalone: true,
  template: `<img [src]="currentSrc" [alt]="alt" loading="lazy" (error)="onError()">`,
  styles: [`
    :host { display: block; width: 100%; height: 100%; }
    img { width: 100%; height: 100%; object-fit: cover; display: block; }
  `]
})
export class FallbackImgComponent implements OnChanges {
  @Input() src = '';
  @Input() alt = '';
  @Input() seed = '';

  currentSrc = '';
  private failed = false;

  ngOnChanges(): void {
    this.failed = false;
    this.currentSrc = this.src || placeholderDataUrl(this.seed || this.alt, this.alt);
  }

  onError(): void {
    if (this.failed) return;
    this.failed = true;
    this.currentSrc = placeholderDataUrl(this.seed || this.alt, this.alt);
  }
}
