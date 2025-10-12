import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteList } from './favourite-list';

describe('FavouriteList', () => {
  let component: FavouriteList;
  let fixture: ComponentFixture<FavouriteList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouriteList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouriteList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
