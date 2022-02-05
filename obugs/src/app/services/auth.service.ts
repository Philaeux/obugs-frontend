import { Injectable } from '@angular/core';
import {Auth, signInWithPopup, signOut, TwitterAuthProvider} from "@angular/fire/auth";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth, private router: Router) { }

  loginWithTwitter() {
    return signInWithPopup(this.auth, new TwitterAuthProvider())
  }

  logout() {
    return signOut(this.auth);
  }
}
