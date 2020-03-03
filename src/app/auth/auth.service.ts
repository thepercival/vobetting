import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { APIRepository } from '../lib/repository';

@Injectable()
export class AuthService extends APIRepository {

  private token: string;

  constructor(private http: HttpClient) {
    super();
    const token = localStorage.getItem('token');
    this.token = token ? token : undefined;
  }

  isLoggedIn(): boolean {
    return this.token !== undefined;
  }

  getUrl(): string {
    return super.getApiUrl() + 'auth';
  }

  getPublicUrl(): string {
    return super.getApiUrl() + 'public/auth';
  }


  validateToken(): Observable<boolean> {
    return this.http.post(this.getUrl() + '/validatetoken', undefined, { headers: super.getHeaders() }).pipe(
      map((res) => true),
      catchError((err) => observableThrowError(err))
    );
  }

  login(password: string): Observable<boolean> {
    return this.http.post(this.getPublicUrl() + '/login', { password }).pipe(
      map((retToken: string) => {
        if (retToken) {
          return this.setToken(retToken);
        } else {
          return false;
        }
      }),
      catchError((err) => this.handleError(err))
    );
  }

  protected setToken(token: string): boolean {
    this.token = token;
    localStorage.setItem('token', token);
    return true;
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = undefined;
    localStorage.removeItem('token');
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    let errortext = 'onbekende fout';
    console.error(error);
    if (typeof error.error === 'string') {
      errortext = error.error;
    } else if (error.statusText !== undefined) {
      errortext = error.statusText;
    }
    return observableThrowError(errortext);
  }
}
