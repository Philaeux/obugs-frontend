import { Injectable } from '@angular/core';
import { User, OBugsError } from '../models/models';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User | undefined | null> = new BehaviorSubject<User | undefined | null>(undefined);
  public currentUser$: Observable<User | undefined | null> = this.currentUserSubject.asObservable();

  public current_user: User | null = null;

  constructor(
    private apollo: Apollo,
    private api: ApiService
  ) {
    const access_token = localStorage.getItem('access_token');
    if (access_token === null) {
      this.currentUserSubject.next(null)
    } else {
      this.fetchUserInfo(access_token)
    }
  }

  fetchUserInfo(access_token: string) {
    if (this.isExpired(access_token)) {
      this.logout()
    } else {
      this.api.userCurrent().subscribe((response) => {
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

  login(token: string) {
    localStorage.setItem('access_token', token)

    return this.api.userCurrent().pipe(tap((response) => {
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
    }));
  }

  logout() {
    this.current_user = null;
    this.currentUserSubject.next(null)
    localStorage.removeItem('access_token');
    this.apollo.client.resetStore()
  }

  isExpired(token: string) {
    try {
      const decoded = jwtDecode(token) as JwtPayload
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

  isRole(softwareId: string | null, softwareRole: number) {
    return this.isUserRole(this.current_user, softwareId, softwareRole)
  }

  isUserRole(user: User | null, softwareId: string | null, softwareRole: number) {
    if (user == null) return false;
    if (softwareId == null) return false;
    for (const edge of user.roles.edges) {
      if (edge.node.softwareId == softwareId && (edge.node.role & softwareRole) != 0) {
        return true
      }
    }
    return false
  }
}
