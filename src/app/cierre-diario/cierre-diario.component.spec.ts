import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CierreDiarioComponent } from './cierre-diario.component';

describe('CierreDiarioComponent', () => {
  let component: CierreDiarioComponent;
  let fixture: ComponentFixture<CierreDiarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CierreDiarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CierreDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
