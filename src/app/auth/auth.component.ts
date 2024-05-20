import { Component, OnInit } from '@angular/core';
import { NgForm, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  token: string = localStorage.getItem('token') || null;
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  success: string = null;
  otp: string = '';
  errorStatus: boolean = false;
  passwordVisible = false;
  password: string;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    if (this.token) {
      this.router.navigate(['/home']);
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = null;
    this.success = null;
    this.errorStatus = false;
  }

  onClose() {
    this.error = null;
    this.success = null;
    this.errorStatus = false;
  }

  onSendOTP(email: string) {
    const otp = this.generateOTP();
    console.log(email, otp);

    this.authService.sendOTP(email, otp)
      .subscribe(
        () => {
          this.otp = otp;
          this.success = 'OTP sent successfully!';
          this.error = null;
          this.errorStatus = true;
        },
        error => {
          this.error = error.error || 'An error occurred while sending OTP.';
          this.success = null;
          this.errorStatus = true;
        }
      );
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    passwordInput.type = this.passwordVisible ? 'text' : 'password';
  }

  onSubmit(form: NgForm) {
    const { name, email, otp, password } = form.value;


    // Check email validity
    if (!form.controls['email'].valid) {
      this.error = 'Invalid email address';
      this.errorStatus = true;
      return;
    }

    // Check OTP
    if (otp && otp !== this.otp) {
      this.error = 'Incorrect OTP';
      this.errorStatus = true;
      return;
    }

    // check name
    if (name && !form.controls['name'].valid) {
      this.error = 'Enter name';
      this.errorStatus = true;
      return;
    }

    // Check form validity
    if (!form.valid) {
      this.error = 'Please fill out all required fields';
      this.errorStatus = true;
      return;
    }

    // Start loading
    this.isLoading = true;

    // Perform authentication
    const authObs = this.isLoginMode
      ? this.authService.login(email, password)
      : this.authService.signUp(name, email, password);

    // Handle authentication response
    authObs.subscribe(
      res => {
        console.log(res);
        this.isLoading = false;
        if (this.isLoginMode) {
          this.authService.setLoginStatus(true)
          this.router.navigate(['/home']);
        } else {
          this.isLoginMode = true;
          this.success = 'Sign up successful! You can now log in.';
          this.errorStatus = true;
        }
      },
      error => {
        this.error = error.error || 'An error occurred.';
        this.isLoading = false;
        this.errorStatus = true;
      }
    );

    // Reset form after submission
    form.reset();
  }

  private generateOTP(): string {
    // Generate and return a random 4-digit OTP
    return Math.random().toString().slice(-4);
  }
}
