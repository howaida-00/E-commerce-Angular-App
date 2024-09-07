import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/interfaces/product';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../core/interfaces/category';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe, JsonPipe, LowerCasePipe, NgClass, SlicePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { TrimTextPipe } from '../../core/pipes/trim-text.pipe';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../core/services/wishlist.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule,RouterLink,NgClass,FormsModule,SearchPipe, TrimTextPipe ,UpperCasePipe,LowerCasePipe,TitleCasePipe,SlicePipe,CurrencyPipe,DatePipe,JsonPipe,TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  catCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    autoplay:true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: false,
    rtl:true
  }
  mainCustomOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    items:1,
    nav: true,
    autoplay:true,
    autoplayTimeout: 2000,
    autoplayHoverPause: true,
    rtl:true
  }

  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService);
  private readonly _WishlistService = inject(WishlistService);

  // productsList:Product[] = [];
  // categoriesList:Category[] = [];

  productsList:WritableSignal<Product[]> = signal([]);
  categoriesList:WritableSignal<Category[]> = signal([]);

  productSub!:Subscription;
  categorySub!:Subscription;

  text:string='';

  wishlistStatus: { [productId: string]: boolean } = {};

  ngOnInit(): void {

   this.categorySub =  this._CategoriesService.GetAllCategories().subscribe({
      next: (res) => {
        this.categoriesList.set(res.data);
      }
    })

    this.productSub = this._ProductsService.GetAllProducts().subscribe({
      next: (res) => {
        this.productsList.set(res.data);
        this.InitializeWishlistStatus();
      }
    })
  }

  ngOnDestroy(): void {
    this.productSub?.unsubscribe();
    this.categorySub?.unsubscribe();
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

  private InitializeWishlistStatus(): void {
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
