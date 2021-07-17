import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe',
  pure: false
})
export class FilterPipePipe implements PipeTransform {

  transform(items: any[],  keys: string, query: string): any {
    if (!items || !query) {
        return items;
    }

    return (items || []).filter(item => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(query, 'gi').test(item[key])));

  }
}
