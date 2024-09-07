import { Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { Category } from '../../core/interfaces/category';
import { Subscription } from 'rxjs';
import { SubCategory } from '../../core/interfaces/sub-category';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit, OnDestroy {

  private readonly _CategoriesService= inject(CategoriesService);
  
  categoriesSub!:Subscription;
  categoriesList:WritableSignal<Category[]> = signal([]);
  // categoriesList:Category[]=[];
  subCategoriesList:SubCategory[]=[];

  isClicked:boolean=false;
  isCatBack:boolean=false;
  isSubCatBack:boolean=false;

  categoryName:string='';

  ngOnInit(): void {
    this.categoriesSub = this._CategoriesService.GetAllCategories().subscribe({
      next: (res) => {
        console.log(res);
        this.isCatBack = true;
        this.categoriesList.set(res.data);
      }
    });
  }

  ngOnDestroy(): void {
    this.categoriesSub?.unsubscribe();
  }

  @ViewChild('targetSection', { static: false }) targetSection!: ElementRef;

  GetSubCategories(categoryId:string, categoryName:string){
    this.isClicked = true;
    this._CategoriesService.GetAllSubCategoriesOnCategory(categoryId).subscribe({
      next: (res) => {
        console.log(res);
        this.subCategoriesList = res.data;
        this.categoryName = categoryName;
        this.isSubCatBack = true;
        if(this.targetSection){
          this.targetSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }


}
