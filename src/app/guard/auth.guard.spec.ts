import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../service/product/Auth/usarios.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['obtenerToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation if token exists', () => {
    authService.obtenerToken.and.returnValue('fake-token'); // Simula un token válido
    expect(guard.canActivate()).toBeTrue();
  });
  
  it('should redirect to login if no token', () => {
    authService.obtenerToken.and.returnValue(null); // Simula la ausencia de un token
    const result = guard.canActivate();
    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toEqual(router.createUrlTree(['/login']));
  });
});
