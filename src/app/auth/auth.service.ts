<<<<<<< HEAD

import {throwError as observableThrowError,  Observable } from 'rxjs';


=======
>>>>>>> dada9cbb704fd2686916e3a5b96f439bdc6f976d
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SportRepository } from 'ngx-sport';
<<<<<<< HEAD
import { catchError ,  map } from 'rxjs/operators';
=======
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
>>>>>>> dada9cbb704fd2686916e3a5b96f439bdc6f976d

import { UserRepository } from '../user/repository';
import { User } from '../user/user';

@Injectable()
export class AuthService extends SportRepository {

  private authItem: IAuthItem;
  private url: string;

  constructor(private http: HttpClient, router: Router, private userRepos: UserRepository) {
    super(router);
    const jsonAuth = JSON.parse(localStorage.getItem('auth'));
    this.authItem = {
      token: jsonAuth ? jsonAuth.token : undefined,
      userid: jsonAuth ? jsonAuth.userid : undefined
    };
    this.url = super.getApiUrl() + this.getUrlpostfix();
  }

  getUrlpostfix(): string {
    return 'auth';
  }

  isLoggedIn(): boolean {
    return this.authItem !== undefined && this.authItem.token !== undefined;
  }

  getLoggedInUserId(): number {
    return this.authItem.userid;
  }

  register(newUser: any): Observable<User> {
    return this.http.post(this.url + '/register', newUser, { headers: super.getHeaders() }).pipe(
      map((res: any) => {
        const authItem: IAuthItem = { token: res.token, userid: res.user.id };
        this.setAuthItem(authItem);
        const user = this.userRepos.jsonToObjectHelper(res.user);
        return user;
      }),
      catchError(this.handleError)
    );
  }

  // activate( email: string, activationkey : string ): Observable<boolean> {
  //   return this.http.post( this.url + '/activate', { email: email, activationkey: activationkey })
  //       .map((response: Response) => response.text() )
  //       .catch(this.handleError);
  // }

  validateToken(): Observable<boolean> {
    return this.http.post(this.url + '/validatetoken', undefined, { headers: super.getHeaders() }).pipe(
      map((res) => true),
      catchError((err) => observableThrowError(err))
    );
  }

  login(emailaddress: string, password: string): Observable<boolean> {
    return this.http.post<IAuthItem>(this.url + '/login', { emailaddress: emailaddress, password: password }).pipe(
      map((res) => {
        if (res && res.token && res.userid) {
          const authItem: IAuthItem = { token: res.token, userid: res.userid };
          return this.setAuthItem(authItem);
        } else {
          return false;
        }
      }),
      catchError((err) => this.handleError(err))
    );
  }


  setAuthItem(authItem: IAuthItem): boolean {
    this.authItem = authItem;
    localStorage.setItem('auth', JSON.stringify(authItem));
    return true;
  }

  passwordReset(email: string): Observable<boolean> {
    return this.http.post(this.url + '/passwordreset', { emailaddress: email }).pipe(
      map((res: any) => {
        return res.retval;
      }),
      catchError(this.handleError)
    );
  }

  passwordChange(emailaddress: string, password: string, code: string): Observable<boolean> {
    return this.http.post(this.url + '/passwordchange', { emailaddress: emailaddress, password: password, code: code }).pipe(
      map((res: any) => {
        if (res && res.token && res.userid) {
          const authItem: IAuthItem = { token: res.token, userid: res.userid };
          return this.setAuthItem(authItem);
        } else {
          return false;
        }
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.authItem = undefined;
    localStorage.removeItem('auth');
  }

  handleError(error: HttpErrorResponse): Observable<any> {
    let errortext = 'onbekende fout';
    console.error(error);
    if (typeof error.error === 'string') {
      errortext = error.error;
    } else if (error.statusText !== undefined) {
      errortext = error.statusText;
    }
    if (error.status === 401) {
      this.router.navigate(['/user/login']);
    }
    return observableThrowError(errortext);
  }
}

interface IAuthItem {
  token: string;
  userid: number;
}
