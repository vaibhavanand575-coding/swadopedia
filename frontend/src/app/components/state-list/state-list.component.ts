import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { StateSummary } from '../../models/state.model';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-state-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './state-list.component.html',
  styleUrl: './state-list.component.scss'
})
export class StateListComponent implements OnInit {
  states: StateSummary[] = [];
  loading = true;
  error = false;

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    this.stateService.getAll().subscribe({
      next: (states) => {
        this.states = states;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }
}
