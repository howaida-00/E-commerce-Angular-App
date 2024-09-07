import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/interfaces/product';
import { Subscription } from 'rxjs';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, JsonPipe, LowerCasePipe, NgClass, SlicePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { TrimTextPipe } from '../../core/pipes/trim-text.pipe';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CarouselModule,RouterLink,NgClass,FormsModule,SearchPipe, TrimTextPipe ,UpperCasePipe,LowerCasePipe,TitleCasePipe,SlicePipe,CurrencyPipe,DatePipe,TranslateModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit,OnDestroy {

  private readonly _ProductsService = inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _WishlistService = inject(WishlistService);

  productsList:WritableSignal<Product[]> = signal([]);

  productSub!:Subscription;

  text:string='';

  wishlistStatus: { [productId: string]: boolean } = {};

  ngOnInit(): void {
    this.productSub = this._ProductsService.GetAllProducts().subscribe({
      next: (res) => {
        this.productsList.set(res.data);
        this.initializeWishlistStatus();
      }
    })
  }

  ngOnDestroy(): void {
    this.productSub?.unsubscribe();
  }

  AddToCart(productId:string){
    this._CartService.AddProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success(res.message , 'FreshCart');
        this._CartService.cartCount.set(res.numOfCartItems);
      }
    });
  }

  AddToWishlist(productId:string){
    this._WishlistService.AddProductToWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);
        if(res.status=='success'){
          this._ToastrService.success(res.message , 'FreshCart');
          this.wishlistStatus[productId] = true;
        }
        else{
          this.wishlistStatus[productId] = false;
        }
      }
    });
  }
  RemoveFromWishList(productId:string){
    this._WishlistService.RemoveProductFromWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);
        if(res.status=='success'){
          this._ToastrService.success(res.message , 'FreshCart');
          this.wishlistStatus[productId] = false;
        }
      }
    });
  }

  private initializeWishlistStatus(): void {
    this._WishlistService.GetLoggedUserWishlist().subscribe({
      next: (res) => {
        if (res.status === 'success') {
          const wishlistProductIds = res.data.map((product: any) => product.id);
          wishlistProductIds.forEach((productId: string) => {
            this.wishlistStatus[productId] = true;
          });
        }
      }
    });
  }
}
