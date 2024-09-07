import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../Enviroments/enviroment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly _HttpClient = inject(HttpClient);

  CheckOutSession(shippingAddress:object, cartId:string | null):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${environment.serverUrl}`,
      {
        "shippingAddress":shippingAddress
      },
    );
  }
  CreateCashOrder(shippingAddress:object, cartId:string | null):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/orders/${cartId}`,
      {
        "shippingAddress":shippingAddress
      },
    );
  }
  GetUserOrders(userId:string):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/orders/user/${userId}`,
    );
  }

}
