import { Component,inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication.service';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass,ReactiveFormsModule,RouterLink,TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly _AuthenticationService = inject(AuthenticationService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);

  accExistMsg:string="";
  isSuccess:boolean=false;

  loginForm: FormGroup = this._FormBuilder.group({
    email: [null , [Validators.required, Validators.email]],
    password: [null , [Validators.required, Validators.pattern(/^.{6,}$/)]],
  }
  );


  loginSubmit():void{
    if(this.loginForm.valid){
      this._AuthenticationService.SignIn(this.loginForm.value).subscribe(
        {
          next: (res) => {
            console.log(res);
            if(res.message=='success'){
              this.accExistMsg="";
              this.isSuccess=true;
              setTimeout(() => {
                localStorage.setItem('userToken',res.token)
                this._AuthenticationService.SaveUserData();
                this._Router.navigate(["/home"]);
              }, 1000);
            }
          }
        }
      );
    }
    
  }

}
