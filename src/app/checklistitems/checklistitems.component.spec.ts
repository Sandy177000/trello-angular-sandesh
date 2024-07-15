import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChecklistitemsComponent } from './checklistitems.component';

describe('ChecklistitemsComponent', () => {
  let component: ChecklistitemsComponent;
  let fixture: ComponentFixture<ChecklistitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChecklistitemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChecklistitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
