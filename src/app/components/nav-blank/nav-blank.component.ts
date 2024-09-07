import { RouterLink, RouterLinkActive } from '@angular/router';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { AuthenticationService } from '../../core/services/authentication.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../core/services/my-translate.service';
import { CartService } from '../../core/services/cart.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLink,RouterLinkActive, TranslateModule,NgClass],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss'
})
export class NavBlankComponent implements OnInit {
  readonly _AuthenticationService=inject(AuthenticationService);
  private readonly _MyTranslateService=inject(MyTranslateService);
  readonly _TranslateService=inject(TranslateService);
  private readonly _CartService = inject(CartService)

  cartCount:Signal<number> = computed(() => this._CartService.cartCount()); 

  ngOnInit(): void {
    this._CartService.GetLoggedUserCart().subscribe({
      next: (res) => {
        this._CartService.cartCount.set(res.numOfCartItems);
      }
    });
  }

  ChangeLang(lang:string){
    this._MyTranslateService.ChangeLang(lang);
  }

}
