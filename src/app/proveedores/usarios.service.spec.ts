import { TestBed } from '@angular/core/testing';

import { UsariosService } from '../service/product/Auth/usarios.service';

describe('UsariosService', () => {
  let service: UsariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
