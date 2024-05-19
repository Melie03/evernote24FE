import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canSeeOwnContentGuard } from './can-see-own-content.guard';

describe('canSeeOwnContentGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canSeeOwnContentGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
