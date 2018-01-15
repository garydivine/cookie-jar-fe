import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IngredientDialogFormComponent } from './ingredient-dialog-form.component';

describe('IngredientDialogFormComponent', () => {
  let component: IngredientDialogFormComponent;
  let fixture: ComponentFixture<IngredientDialogFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngredientDialogFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngredientDialogFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
