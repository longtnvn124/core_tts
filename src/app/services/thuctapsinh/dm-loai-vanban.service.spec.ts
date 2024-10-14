import { TestBed } from '@angular/core/testing';

import { DmLoaiVanbanService } from './dm-loai-vanban.service';

describe('DmLoaiVanbanService', () => {
  let service: DmLoaiVanbanService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DmLoaiVanbanService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
