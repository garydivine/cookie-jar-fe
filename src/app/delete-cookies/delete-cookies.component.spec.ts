import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCookiesComponent } from './delete-cookies.component';

describe('DeleteCookiesComponent', () => {
  let component: DeleteCookiesComponent;
  let fixture: ComponentFixture<DeleteCookiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCookiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCookiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
