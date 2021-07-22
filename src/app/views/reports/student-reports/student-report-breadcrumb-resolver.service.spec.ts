import { TestBed } from '@angular/core/testing';

import { StudentReportBreadcrumbResolverService } from './student-report-breadcrumb-resolver.service';

describe('StudentReportBreadcrumbResolverService', () => {
  let service: StudentReportBreadcrumbResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentReportBreadcrumbResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
