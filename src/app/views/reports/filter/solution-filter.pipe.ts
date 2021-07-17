import { Pipe, PipeTransform } from '@angular/core';
import { FilterModel } from './filter.component';

@Pipe({
  name: 'solutionFilterPipe',
  pure: false
})
export class SolutionFilterPipe implements PipeTransform {

  transform(items: any[], filter: {filterData ? :FilterModel}): any {
    if (!items || !filter) {
        return items;
    }
    // filter items array, items which match and return true will be
    // kept, false will be filtered out
    let filterItems = items;
    if( filter?.filterData?.state != undefined && filter?.filterData?.state.length != 0)
    filterItems = items.filter(item =>  filter.filterData.state.includes(item.answerStatus));

    if(filter?.filterData?.difficulty != undefined && filter?.filterData?.difficulty.length != 0 )
    filterItems = items.filter(item =>   filter.filterData.difficulty.includes(item.difficultyLevel ));

    if( filter?.filterData?.subject != undefined  && filter?.filterData?.subject.length != 0)
    filterItems = items.filter(item =>   filter.filterData.subject.includes(item.subject));

    if(filter?.filterData?.topic != undefined && filter?.filterData?.topic.length != 0 )
    filterItems = items.filter(item =>   filter.filterData.topic.includes(item.topic));

    if(filter?.filterData?.subtopic != undefined  && filter?.filterData?.subtopic.length != 0 )
    filterItems = items.filter(item =>  filter.filterData.subtopic.includes(item.subTopic));



    return filterItems;
  }
}
