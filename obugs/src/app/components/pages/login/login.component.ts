import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, ValidationErrors, AbstractControlOptions } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Recaptchav2Service } from 'src/app/services/recaptchav2.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  subscription: Subscription | null = null;

  loginForm: FormGroup;
  registerForm: FormGroup;

  messageLogin: string = "";
  errorLogin: string = "";
  messageRegister: string = "";
  errorRegister: string = "";

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private recaptchav2Service: Recaptchav2Service
  ) {
    this.loginForm = this.fb.group({
      loginUsername: ['', [Validators.required, Validators.minLength(3)]],
      loginPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.registerForm = this.fb.group({
      registerUsername: ['', [Validators.required, Validators.minLength(3)]],
      registerPassword: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', Validators.required],
      registerEmail: ['', [Validators.required, Validators.email]],
      repeatEmail: ['', [Validators.required, Validators.email]]
    }, { validator: this.customRegisterValidator } as AbstractControlOptions);
  }

  ngOnInit(): void {
    this.recaptchav2Service.recaptchav2$.subscribe((token) => {
      this.onRegisterSubmit(token)
    });

    const username = this.route.snapshot.queryParamMap.get('username');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (username && token) {
      this.authService.activate(username, token).subscribe(
        data => {
          this.errorLogin = data.error;
          this.messageLogin = data.message;
        }
      )
    }
  }

  customRegisterValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('registerPassword')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;
    const email = control.get('registerEmail')?.value;
    const repeatEmail = control.get('repeatEmail')?.value;

    let error = { 'passwordMismatch': false, 'emailMismatch': false }
    if (password !== repeatPassword) {
      error.passwordMismatch = true;
      control.get('repeatPassword')?.setErrors({ 'passwordMismatch': true });
    }
    if (email !== repeatEmail) {
      error.emailMismatch = true;
      control.get('repeatEmail')?.setErrors({ 'emailMismatch': true });
    }

    if (error.emailMismatch || error.passwordMismatch) {
      return error;
    } else {
      return null;
    }
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      this.errorLogin = "";
      this.messageLogin = "";

      this.authService.login(
        this.loginForm.value.loginUsername,
        this.loginForm.value.loginPassword).subscribe(
          data => {
            this.errorLogin = data.error;
            if (this.errorLogin == "") {
              this.router.navigate(["/"]);
            }
          }
        )
    }
  }

  onRegisterButton() {
    grecaptcha.execute();
  }

  onRegisterSubmit(token: string): void {
    if (this.registerForm.valid) {
      this.errorRegister = "";
      this.messageRegister = "";
      grecaptcha.reset()

      this.authService.register(
        this.registerForm.value.registerUsername,
        this.registerForm.value.registerPassword,
        this.registerForm.value.registerEmail,
        token).subscribe(
          data => {
            this.errorRegister = data.error;
            this.messageRegister = data.message;
          }
        )
    }
  }

  public ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe()
  }
}
