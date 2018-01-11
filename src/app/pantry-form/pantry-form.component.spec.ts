import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PantryFormComponent } from './pantry-form.component';

describe('PantryFormComponent', () => {
  let component: PantryFormComponent;
  let fixture: ComponentFixture<PantryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PantryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
