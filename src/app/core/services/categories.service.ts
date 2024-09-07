import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../Enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  _HttpClient = inject(HttpClient);

  GetAllCategories():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/categories`);
  }
  GetSpecificCategory(id:string):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/categories/${id}`);
  }
  GetAllSubCategoriesOnCategory(categoryId:string):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/categories/${categoryId}/subcategories`);
  }
}
