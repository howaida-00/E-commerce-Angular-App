import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../core/interfaces/product';
import { WishlistService } from '../../core/services/wishlist.service';
import { CurrencyPipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { CartService } from '../../core/services/cart.service';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CurrencyPipe,RouterLink,TranslateModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit, OnDestroy{

  private readonly _WishlistService = inject(WishlistService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _CartService = inject(CartService);
  
  productList:Product[]=[];

  isBack:boolean=false;

  wishlistSub!:Subscription;

  ngOnInit(): void {
    this.wishlistSub = this._WishlistService.GetLoggedUserWishlist().subscribe({
      next: (res) => {
        console.log(res.data);
        this.productList = res.data;
        this.isBack=true;
      }
    });
  }
  AddToCart(productId:string){
    this._CartService.AddProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this._CartService.cartCount.set(res.numOfCartItems);
        this._ToastrService.success(res.message , 'FreshCart')
        if(res.status == 'success'){
          this.RemoveFromWishList(productId);
        }
      }
    });
  }
  RemoveFromWishList(productId:string){
    this._WishlistService.RemoveProductFromWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);
        this.productList = this.productList.filter((product) => product.id !== productId);
        if(res.status=='success'){
          this._ToastrService.success(res.message , 'FreshCart');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.wishlistSub.unsubscribe();
  }
}
