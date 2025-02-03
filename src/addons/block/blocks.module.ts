import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddonBlockRecentlyAccessedItemsModule } from './recentlyaccesseditems/recentlyaccesseditems.module';

@NgModule({
    imports: [
        CommonModule,
        AddonBlockRecentlyAccessedItemsModule,
    ],
})
export class AddonBlocksModule {}
