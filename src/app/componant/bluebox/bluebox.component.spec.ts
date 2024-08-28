import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlueboxComponent } from './bluebox.component';

describe('BlueboxComponent', () => {
  let component: BlueboxComponent;
  let fixture: ComponentFixture<BlueboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlueboxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BlueboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
