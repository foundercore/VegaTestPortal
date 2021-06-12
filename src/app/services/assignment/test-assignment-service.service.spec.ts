/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TestAssignmentServiceService } from './test-assignment-service.service';

describe('Service: TestAssignmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TestAssignmentServiceService]
    });
  });

  it('should ...', inject([TestAssignmentServiceService], (service: TestAssignmentServiceService) => {
    expect(service).toBeTruthy();
  }));
});
