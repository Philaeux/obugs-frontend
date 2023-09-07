import { Injectable, OnInit } from '@angular/core';
import { AuthPayload, User } from '../models/models';
import { HttpClient } from '@angular/common/http';
import { environment } from "../../environments/environment";
import { Observable, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { QUERY_CURRENT_USER } from '../models/graphql';
import { QueryResponseCurrentUser } from 'src/app/models/graphql';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public current_user: User | null = null;

  constructor(private http: HttpClient, private apollo: Apollo) {
    const access_token = localStorage.getItem('access_token');
    if (access_token != null) {
      this.refreshCurrentUserInfo()
    }
  }

  register(username: string, password: string, email: string): Observable<AuthPayload> {
    return this.http.post<AuthPayload>(`${environment.obugsBackend}/register`, { username: username, password: password, email: email });
  }

  activate(username: string, token: string): Observable<AuthPayload> {
    return this.http.post<AuthPayload>(`${environment.obugsBackend}/activate`, { username: username, token: token });
  }

  login(username: string, password: string): Observable<AuthPayload> {
    return this.http.post<AuthPayload>(`${environment.obugsBackend}/login`, { username: username, password: password }).pipe(tap(data => {
      if (data.error == '') {
        localStorage.setItem('access_token', data.message);
        this.refreshCurrentUserInfo();
      }
    }));
  }

  isLogged() {
    return this.current_user != null;
  }

  refreshCurrentUserInfo() {
    this.apollo
      .query<QueryResponseCurrentUser>({
        query: QUERY_CURRENT_USER
      }).subscribe((response) => {
        this.current_user = response.data.currentUser;
      });
  }

  logout() {
    this.current_user = null;
    localStorage.removeItem('access_token');
  }
}
