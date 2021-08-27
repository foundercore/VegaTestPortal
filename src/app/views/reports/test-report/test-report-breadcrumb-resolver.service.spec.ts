import { TestBed } from '@angular/core/testing';

import { TestReportBreadcrumbResolverService } from './test-report-breadcrumb-resolver.service';

describe('TestReportBreadcrumbResolverService', () => {
  let service: TestReportBreadcrumbResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestReportBreadcrumbResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
