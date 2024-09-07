import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, RendererFactory2, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class MyTranslateService {
  private readonly _TranslateService = inject(TranslateService);
  private readonly _PLATFORM_ID = inject(PLATFORM_ID);
  private readonly _Renderer2 = inject(RendererFactory2).createRenderer(null, null);

  constructor(){
    if(isPlatformBrowser(this._PLATFORM_ID)){

      this._TranslateService.setDefaultLang('en');
      
      this.SetLang();

    }
  
  }


   SetLang():void {
    
    let savedLang  = localStorage.getItem('lang'); 

    if(savedLang!==null){
      this._TranslateService.use(savedLang!);
    }
    if(localStorage.getItem('lang') === 'en'){
      this._Renderer2.setAttribute(document.documentElement,'dir','ltr');
      this._Renderer2.setAttribute(document.documentElement,'lang','en');
    }
    else if (localStorage.getItem('lang') === 'ar') {
      this._Renderer2.setAttribute(document.documentElement,'dir','rtl');
      this._Renderer2.setAttribute(document.documentElement,'lang','ar');
    }

   }

   ChangeLang(lang : string):void {
      if(isPlatformBrowser(this._PLATFORM_ID)){
        localStorage.setItem('lang'  , lang);
        this.SetLang();
      }
   }

}
