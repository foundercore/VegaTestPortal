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
    if(filter?.filterData?.state != '' && filter?.filterData?.state != undefined)
    filterItems = items.filter(item => item.answerStatus === filter.filterData.state.toUpperCase());

    if(filter?.filterData?.difficulty != '' && filter?.filterData?.difficulty != undefined)
    filterItems = items.filter(item => item.difficultyLevel === filter.filterData.difficulty.toUpperCase());

    if(filter?.filterData?.subject != '' && filter?.filterData?.subject != undefined)
    filterItems = items.filter(item => item.subject === filter.filterData.subject.toUpperCase());

    if(filter?.filterData?.topic != '' && filter?.filterData?.topic != undefined)
    filterItems = items.filter(item => item.topic === filter.filterData.topic.toUpperCase());

    if(filter?.filterData?.subtopic != '' && filter?.filterData?.subtopic != undefined)
    filterItems = items.filter(item => item.subTopic === filter.filterData.subtopic.toUpperCase());



    return filterItems;
  }
}
