import { Module } from '@nestjs/common';

import { StoreService } from './services/store.service';

@Module({
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
