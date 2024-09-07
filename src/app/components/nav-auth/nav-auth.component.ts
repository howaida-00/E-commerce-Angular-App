import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../core/services/my-translate.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-nav-auth',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,TranslateModule,NgClass],
  templateUrl: './nav-auth.component.html',
  styleUrl: './nav-auth.component.scss'
})
export class NavAuthComponent {

  private readonly _MyTranslateService=inject(MyTranslateService);
  readonly _TranslateService=inject(TranslateService);

  ChangeLang(lang:string){
    this._MyTranslateService.ChangeLang(lang);
  }

}
