/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StudentBatchService } from './student-batch.service';

describe('Service: StudentBatch', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudentBatchService]
    });
  });

  it('should ...', inject([StudentBatchService], (service: StudentBatchService) => {
    expect(service).toBeTruthy();
  }));
});
