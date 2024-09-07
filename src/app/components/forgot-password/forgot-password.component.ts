import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication.service';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass,TranslateModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _AuthenticationService = inject(AuthenticationService);
  private readonly _Router = inject(Router)

  step:number = 1;
  isLoading:boolean=false;

  verifyEmail:FormGroup = this._FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });
  verifyCode:FormGroup = this._FormBuilder.group({
    resetCode: ['', [Validators.required, Validators.pattern(/^[0-9]{4,}$/)]],
  });
  resetPassword:FormGroup = this._FormBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    newPassword: ['', [Validators.required, Validators.pattern(/^.{6,}$/)]],
  });

  AutofillResetPasswordEmail() {
    const emailValue = this.verifyEmail.get('email')?.value;
    this.resetPassword.patchValue({
      email: emailValue,
    });
  }

  VerifyEmailSubmit():void{
    if(this.verifyEmail.valid){
      this.isLoading=true;
      this._AuthenticationService.ForgotPassword(this.verifyEmail.value).subscribe({
        next: (res) => { 
          if(res.statusMsg == "success"){
            this.step = 2;
          }
          this.isLoading=false;
        }
      });
    }
  }
  VerifyResetCodeSubmit():void{
    if(this.verifyCode.valid){
      this.isLoading=true;
      this._AuthenticationService.VerifyResetCode(this.verifyCode.value).subscribe({
        next: (res) => {
          if(res.status == "Success"){
            this.step = 3;
          }   
          this.isLoading=false;
        }
      });
    }
  }

  ResetPasswordSubmit():void{
    if(this.resetPassword.valid){
      this.isLoading=true;
      this._AuthenticationService.ResetPassword(this.resetPassword.value).subscribe({
        next: (res) => {
            localStorage.setItem('userToken',res.token);
            this._AuthenticationService.SaveUserData();
            this._Router.navigate(["/home"]); 
            this.isLoading=false;
        }
      })
    }
  }

}
