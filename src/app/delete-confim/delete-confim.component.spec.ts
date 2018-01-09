import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConfimComponent } from './delete-confim.component';

describe('DeleteConfimComponent', () => {
  let component: DeleteConfimComponent;
  let fixture: ComponentFixture<DeleteConfimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteConfimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteConfimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
