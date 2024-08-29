import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Olympic } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Olympic[] | null | undefined>(
    undefined
  );
  /**
   * Constructor for OlympicService.
   * @param http  HttpClient for HTTP requests
   */
  constructor(private http: HttpClient) {}
  /**
   * Loads the initial data for Olympics by making an HTTP GET request
   * @returns  {Observable<Olympic[] | null>} Observable that emits the fetched data or `null` on error.
   */
  loadInitialData() {
    return this.http.get<Olympic[]>(this.olympicUrl).pipe(
      tap((value) => {
        console.log(value[1].id);
        this.olympics$.next(value);
      }),

      catchError((error) => {
        console.error(
          'Erreur lors du chargement des données des Jeux Olympiques :',
          error
        );
        this.olympics$.next(null);
        return of(null);
      })
    );
  }
  /**
   *Provides an observable of the current state of the Olympic data.
   * @returns {Observable<Olympic[] | null | undefined>} Observable of the Olympic data
   */
  getOlympics() {
    return this.olympics$.asObservable();
  }
}
