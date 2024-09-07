import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Product } from '../../core/interfaces/product';
import { Cart } from '../../core/interfaces/cart';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink,CurrencyPipe, TranslateModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit,OnDestroy {

  private readonly _CartService = inject(CartService);
  private readonly _TostrService = inject(ToastrService);

  cartDetails:Cart = {} as Cart;
  isBack:boolean=false;

  cartSub!:Subscription;

  ngOnInit(): void {
      this.cartSub = this._CartService.GetLoggedUserCart().subscribe({
        next: (res) => {
          console.log(res.data);

          this.cartDetails = res.data;
          this.isBack = true;
        }
      });
  }

  RemoveItem(productId:string){
    this._CartService.RemoveSpecificCartItem(productId).subscribe({
      next: (res) => {
        this.cartDetails = res.data;
        this._TostrService.info('Item removed from your cart', 'FreshCart');
        this._CartService.cartCount.set(res.numOfCartItems);
      }
    });
  }

  UpdateProductQuantity(productId:string, count:number){
    this._CartService.UpdateCartProductQuantity(productId,count).subscribe({
      next: (res) => {
        console.log(res);
        this.cartDetails = res.data;
        this._TostrService.info("Quantity Updated","FreshCart");
        if(count===0){
          this._CartService.cartCount.set(res.numOfCartItems);
        }
      }
    });
  }
  ClearCart(){
    this._CartService.ClearUserCart().subscribe({
      next: (res) => {
        if(res.message=='success'){
          this.cartDetails={} as Cart;
          this.cartDetails.totalCartPrice = 0;
          this._TostrService.warning("Your cart is empty", "FreshCart");
          this._CartService.cartCount.set(0);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.cartSub.unsubscribe();
  }

}
