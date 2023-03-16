import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn: Boolean = false;
  username: String | undefined;

  constructor() {

  }

  loginWithGoogle() {

  }

  loginWithTwitter() {

  }

  logout() {

  }
}
