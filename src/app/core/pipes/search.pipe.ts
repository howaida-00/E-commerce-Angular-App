import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(list:any[],term:string): any[] {
    if(term === '') return list;
    return list.filter(item => item.title.toLowerCase().includes(term.toLowerCase()));
  }

}
