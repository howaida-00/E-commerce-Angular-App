import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../core/interfaces/product';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Subscription } from 'rxjs';
import { CurrencyPipe, NgClass, SlicePipe, UpperCasePipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CarouselModule,NgClass, CurrencyPipe, SlicePipe, UpperCasePipe, TranslateModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  productImgCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    items:1,
    nav: false,
  }

  private readonly _ProductsService = inject(ProductsService);
  private readonly _ActivatedRoute = inject(ActivatedRoute);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _WishlistService = inject(WishlistService);


  wishlistStatus: { [productId: string]: boolean } = {};

  product:Product | null = null;

  productSub!:Subscription;
  routeSub!:Subscription;

  ngOnInit(): void {
    // let id = this._ActivatedRoute.snapshot.paramMap.get('id');
    
    this.routeSub = this._ActivatedRoute.paramMap.subscribe({
      next: (params) => {
        let id = params.get('id');
        this.productSub = this._ProductsService.GetSpecificProduct(id !).subscribe({
          next: (product) => {
            this.product = product.data;
            this.initializeWishlistStatus();
          }
        })
      }
    });
    
  }
  ngOnDestroy(): void {
    this.productSub.unsubscribe();
    this.routeSub.unsubscribe();
  }

  AddToCart(productId:string){
    this._CartService.AddProductToCart(productId).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success(res.message, 'FreshCart');
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
