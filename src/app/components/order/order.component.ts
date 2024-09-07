import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdersService } from '../../core/services/orders.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, TranslateModule ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss'
})
export class OrderComponent {
  private readonly _FormBuilder = inject(FormBuilder);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _OrdersService = inject(OrdersService);
  private readonly _Router = inject(Router);
  private readonly _ToastrService = inject(ToastrService);


  cartId:string | null='';
  clickedButton: string = '';

  orderForm: FormGroup = this._FormBuilder.group({
    details: [null , [Validators.required]],
    phone: [null , [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city:[null,[Validators.required,]]
  }
  );

  ngOnInit(): void {
    this.cartId = this._ActivatedRoute.snapshot.paramMap.get('id');
  }
  
  CheckOutSubmit(){
    if (this.orderForm.valid) {
      this._OrdersService.CheckOutSession(this.orderForm.value,this.cartId).subscribe({
        next: (res) => {
          console.log(res);
          if(res.status == 'success'){
            window.open(res.session.url,"_self");
          }
        }
      });
    }
  }

  CODSubmit(){
    if (this.orderForm.valid) {
      this._OrdersService.CreateCashOrder(this.orderForm.value,this.cartId).subscribe({
        next: (res) => {
          console.log(res);
          if(res.status == 'success'){
            this._ToastrService.success("Your order has been placed successfully","FreshCart");
            this._Router.navigate(['/allorders']);
          }
        }
      });
    }
  }

  OnSubmit(action: string) {
    if (action === 'card') {
      this.CheckOutSubmit();
    } else if (action === 'cach') {
      this.CODSubmit();
    }
  }

}
