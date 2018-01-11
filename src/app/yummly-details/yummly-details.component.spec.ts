import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YummlyDetailsComponent } from './yummly-details.component';

describe('YummlyDetailsComponent', () => {
  let component: YummlyDetailsComponent;
  let fixture: ComponentFixture<YummlyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YummlyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YummlyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
