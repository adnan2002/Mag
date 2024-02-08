import { TestBed } from '@angular/core/testing';

import { CapStorageService } from './cap-storage.service';

describe('CapStorageService', () => {
  let service: CapStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
