import { Injectable, OnInit } from '@angular/core';
import { AuthPayload, User, OBugsError } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { BehaviorSubject, Observable, filter, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { QUERY_CURRENT_USER } from "../models/graphql/queries/user";
import { QueryResponseCurrentUser } from "../models/graphql/queries/user";
import jwt_decode, { JwtPayload } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User | undefined | null> = new BehaviorSubject<User | undefined | null>(undefined);
  public currentUser$: Observable<User | undefined | null> = this.currentUserSubject.asObservable();

  public current_user: User | null = null;

  constructor(private http: HttpClient, private apollo: Apollo) {
    this.initUserIfNecessary()
  }

  register(username: string, password: string, email: string, recaptcha: string = ""): Observable<AuthPayload> {
    return this.http.post<AuthPayload>(`${environment.obugsBackend}/register`, { username: username, password: password, email: email, recaptcha: recaptcha });
  }

  activate(username: string, token: string): Observable<AuthPayload> {
    return this.http.post<AuthPayload>(`${environment.obugsBackend}/activate`, { username: username, token: token });
  }

  login(username: string, password: string): Observable<AuthPayload> {
    return this.http.post<AuthPayload>(`${environment.obugsBackend}/login`, { username: username, password: password }).pipe(tap(data => {
      if (data.error == '') {
        localStorage.setItem('access_token', data.message);
      }
    }));
  }

  initUserIfNecessary() {
    const access_token = localStorage.getItem('access_token');
    if (access_token === null) {
      this.currentUserSubject.next(null)
    } else {
      if (this.isExpired(access_token)) {
        this.logout()
      } else {
        this.apollo
          .query<QueryResponseCurrentUser>({
            query: QUERY_CURRENT_USER
          }).subscribe((response) => {
            const data = response.data.currentUser
            if (data.__typename === 'OBugsError') {
              const error = data as OBugsError
              console.log(error.message)
              this.logout()
            } else {
              const user = data as User
              this.current_user = user
              this.currentUserSubject.next(this.current_user)
            }
          });
      }
    }
  }

  logout() {
    this.current_user = null;
    this.currentUserSubject.next(null)
    localStorage.removeItem('access_token');
    this.apollo.client.resetStore()
  }

  isExpired(token: string) {
    try {
      const decoded = jwt_decode(token) as JwtPayload
      if (decoded.exp == null) return true;
      if (Date.now() >= decoded.exp * 1000) return true;
    } catch (err) {
      return true;
    }
    return false;
  }

  isAdmin() {
    if (this.current_user == null) return false;
    return this.current_user.isAdmin
  }

  isRole(softwareId: string | null, role: string) {
    if (softwareId == null) return false;
    if (this.current_user == null) return false;
    if (role == 'mod') {
      return this.current_user.softwareIsMod.includes(softwareId);
    } else if (role == 'curator') {
      return this.current_user.softwareIsCurator.includes(softwareId);
    } else if (role == 'editor') {
      return this.current_user.softwareIsEditor.includes(softwareId);
    } else {
      return false
    }
  }
}
