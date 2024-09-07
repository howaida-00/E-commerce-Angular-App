import { Component, inject, OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { OrdersService } from '../../core/services/orders.service';
import { jwtDecode } from 'jwt-decode';
import { Order } from '../../core/interfaces/order';
import { CurrencyPipe, DatePipe, TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-orders',
  standalone: true,
  imports: [CurrencyPipe,DatePipe,TitleCasePipe,RouterLink,TranslateModule],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent implements OnInit, OnDestroy {

  private readonly _OrdersService = inject(OrdersService);
  private readonly _CartService = inject(CartService);

  ordersList: Order[] = [];
  
  isBack:boolean=false;

  cartSub!:Subscription;
  ordersSub!:Subscription;

  userData: any = jwtDecode(localStorage.getItem('userToken')!);

  ngOnInit(): void {
    console.log(this.userData.id);
    this.cartSub = this._CartService.GetLoggedUserCart().subscribe({
      next: (res) => {
        this._CartService.cartCount.set(res.numOfCartItems);
      }
    });
    this.ordersSub = this._OrdersService.GetUserOrders(this.userData.id).subscribe({
      next: (res) => {
        console.log(res);
        this.ordersList = res.reverse();
        this.isBack=true;
      }
    });
  }

  ngOnDestroy(): void {
    this.cartSub.unsubscribe();
    this.ordersSub.unsubscribe();
  }
}
