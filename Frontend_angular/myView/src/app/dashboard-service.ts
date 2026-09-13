import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Journal } from './journal-service';

export interface DashboardMetrics {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  totalPnl: number;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) { }

  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/metrics`);
  }

  getRecentTrades(): Observable<Journal[]> {
    return this.http.get<Journal[]>(`${this.apiUrl}/recent-trades`);
  }

  getAllTradesForChart(): Observable<Journal[]> {
    return this.http.get<Journal[]>(`${this.apiUrl}/all-trades`);
  }
}
