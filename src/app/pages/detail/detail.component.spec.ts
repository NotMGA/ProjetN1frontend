import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailComponant } from './detail.component';
import { Router } from '@angular/router';
let mockRouter: any;

describe('DetailComponant', () => {
  let component: DetailComponant;
  let fixture: ComponentFixture<DetailComponant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailComponant],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponant);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should navigate to home when navigateToHome is called', () => {
    component.navigateToHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });
});
