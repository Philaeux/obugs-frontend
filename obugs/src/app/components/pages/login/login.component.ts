import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {Auth} from "@angular/fire/auth";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private auth: Auth,
    private authService: AuthService,
    private router: Router
  ) {
  }

  ngOnInit(): void {

  }

  loginWithTwitter() {
    this.authService.loginWithTwitter()
      .then((result) => {
        console.log(result)
        this.router.navigate(['/account'])
      })
      .catch((e) => console.log(e.message));
  }

}
