import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { State, StateSummary } from '../models/state.model';

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly baseUrl = 'http://localhost:8081/api/states';

  constructor(private http: HttpClient) {}

  getAll(): Observable<StateSummary[]> {
    return this.http.get<StateSummary[]>(this.baseUrl);
  }

  getById(id: string): Observable<State> {
    return this.http.get<State>(`${this.baseUrl}/${id}`);
  }
}
