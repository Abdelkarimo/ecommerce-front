import { TestBed } from '@angular/core/testing';

import { Favourite } from './favourite';

describe('Favourite', () => {
  let service: Favourite;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Favourite);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
