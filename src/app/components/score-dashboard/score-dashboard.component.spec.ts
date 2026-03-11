import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreDashboardComponent } from './score-dashboard.component';

describe('ScoreDashboardComponent', () => {
  let component: ScoreDashboardComponent;
  let fixture: ComponentFixture<ScoreDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScoreDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
