import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../Enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CartService {


  private readonly _HttpClient = inject(HttpClient);

  cartCount:WritableSignal<number>= signal(0);
 

  AddProductToCart(id:string):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/cart`,
      {"productId":id},
    );
  }
  GetLoggedUserCart():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/cart`,
    );
  }
  RemoveSpecificCartItem(id:string):Observable<any>{
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart/${id}`,
    );
  }
  UpdateCartProductQuantity(id:string, count:number):Observable<any>{
    return this._HttpClient.put(`${environment.baseUrl}/api/v1/cart/${id}`,
      {"count":count},
    );
  }
  ClearUserCart():Observable<any>{
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/cart/`,
    );
  }

}
