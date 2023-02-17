import {Injectable} from '@angular/core';
import {Auth, signInWithPopup, signOut, TwitterAuthProvider, GoogleAuthProvider} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: Auth) {
  }

  loginWithGoogle() {
    return signInWithPopup(this.afAuth, new GoogleAuthProvider());
  }

  loginWithTwitter() {
    return signInWithPopup(this.afAuth, new TwitterAuthProvider())
  }

  logout() {
    return signOut(this.afAuth);
  }
}
