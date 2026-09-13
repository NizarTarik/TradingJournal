import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface JournalImage {
  url: string;
  description: string;
}

export interface Journal {
  id?: number;
  symbol: string;
  type: 'LONG' | 'SHORT';
  tradeTime: string;
  pnl: number;
  setup: string;
  confidence: number;
  notes: string;
  images: JournalImage[];
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  private apiUrl = 'http://localhost:8080/api/journals';

  constructor(private http: HttpClient) { }

  getJournals(): Observable<Journal[]> {
    return this.http.get<Journal[]>(this.apiUrl);
  }

  addTrade(trade: Journal): Observable<Journal> {
    return this.http.post<Journal>(this.apiUrl, trade);
  }


}
