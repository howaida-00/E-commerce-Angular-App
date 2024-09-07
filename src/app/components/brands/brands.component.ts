import { Component, inject, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { Brand } from '../../core/interfaces/brand';
import { BrandsService } from '../../core/services/brands.service';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [RouterLink,FormsModule,TranslateModule],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit,OnDestroy {
  
  private readonly _BrandsService= inject(BrandsService);
  
  brandsSub!:Subscription;
  brandsList:WritableSignal<Brand[]> = signal([]);

  ngOnInit(): void {
    this.brandsSub = this._BrandsService.GetAllBrands().subscribe({
      next: (res) => {
        this.brandsList.set(res.data);
      }
    });
  }

  ngOnDestroy(): void {
    this.brandsSub?.unsubscribe();
  }
}
