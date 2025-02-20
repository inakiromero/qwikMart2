import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionDialogoComponent } from './confirmacion-dialogo.component';

describe('ConfirmacionDialogoComponent', () => {
  let component: ConfirmacionDialogoComponent;
  let fixture: ComponentFixture<ConfirmacionDialogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmacionDialogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmacionDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
