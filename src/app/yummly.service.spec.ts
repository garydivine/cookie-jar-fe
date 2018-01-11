import { TestBed, inject } from '@angular/core/testing';

import { YummlyService } from './yummly.service';

describe('YummlyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YummlyService]
    });
  });

  it('should be created', inject([YummlyService], (service: YummlyService) => {
    expect(service).toBeTruthy();
  }));
});
