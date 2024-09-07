import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../Enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {


  private readonly _HttpClient = inject(HttpClient);

  AddProductToWishlist(productId:string):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/wishlist`,
      {
        "productId": productId
      },
    );
  }
  RemoveProductFromWishlist(productId:string):Observable<any>{
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${productId}`,
    );
  }
  GetLoggedUserWishlist():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/wishlist`,
    );
  }
}
