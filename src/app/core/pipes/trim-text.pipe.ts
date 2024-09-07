import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trimText',
  standalone: true
})
export class TrimTextPipe implements PipeTransform {

  transform(text: string, limit:number): string {
    return text.split(' ',limit).join(' ');
  }

}
