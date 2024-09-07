import { Component,inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthenticationService } from '../../core/services/authentication.service';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,NgClass,TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  private readonly _AuthenticationService = inject(AuthenticationService);
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _Router = inject(Router);

  accExistMsg:string="";
  isSuccess:boolean=false;

  registerSub!:Subscription;

  registerForm: FormGroup = this._FormBuilder.group({
    name : [null , [Validators.required, Validators.minLength(6)]],
    email: [null , [Validators.required, Validators.email]],
    password: [null , [Validators.required, Validators.pattern(/^.{6,}$/)]],
    rePassword: [null , ],
    phone: [null , [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
  },{validators:[this.confirmPassword]}
  )



  //custom validation
  confirmPassword(formGroup:AbstractControl){
    if(formGroup.get("password")?.value === formGroup.get("rePassword")?.value){
      return null;
    }
    return {mismatch:true};
  }
  registerSubmit():void{

    if(this.registerForm.valid){
      this.registerSub =  this._AuthenticationService.SignUp(this.registerForm.value).subscribe(
        {
          next: (res) => {
            console.log(res);
            if(res.message=='success'){
              this.accExistMsg="";
              this.isSuccess=true;
              setTimeout(() => {
                this._Router.navigate(["/login"]);
              }, 2000);
            }
          }
        }
      );
    }
  }

  ngOnDestroy(): void {
    this.registerSub?.unsubscribe();
  }

}
