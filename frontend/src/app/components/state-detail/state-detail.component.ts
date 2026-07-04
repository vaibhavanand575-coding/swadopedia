import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { State } from '../../models/state.model';
import { StateService } from '../../services/state.service';
import { FallbackImgComponent } from '../fallback-img/fallback-img.component';

@Component({
  selector: 'app-state-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FallbackImgComponent],
  templateUrl: './state-detail.component.html',
  styleUrl: './state-detail.component.scss'
})
export class StateDetailComponent implements OnInit {
  state: State | null = null;
  loading = true;
  error = false;

  constructor(private route: ActivatedRoute, private stateService: StateService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = true;
      this.loading = false;
      return;
    }
    this.stateService.getById(id).subscribe({
      next: (state) => {
        this.state = state;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
