import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject , of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null | undefined >(undefined);

  constructor(private http: HttpClient) {}

  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        console.log(value[1].id)
        this.olympics$.next(value)}),
      
      catchError((error) => {
        console.error('Erreur lors du chargement des données des Jeux Olympiques :', error);
        this.olympics$.next(null);
        return of(null);
      })
      
    );
  }

  getOlympics() {
    
    return this.olympics$.asObservable() ;
    
  }
}
