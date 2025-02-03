import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CoreBlockDelegate } from '@features/block/services/block-delegate';
import { AddonBlockRecentlyAccessedItemsHandlerService } from './services/block-handler';
import { AddonBlockRecentlyAccessedItemsComponent } from './components/recentlyaccesseditems/recentlyaccesseditems';
import { CoreSharedModule } from '@/core/shared.module';
import { CommonModule, DatePipe } from '@angular/common';
import { CoreComponentsModule } from '@components/components.module';

@NgModule({
    declarations: [
        AddonBlockRecentlyAccessedItemsComponent,
    ],
    imports: [
        IonicModule,
        CoreSharedModule,
        CommonModule,
        CoreComponentsModule,
    ],
    exports: [
        AddonBlockRecentlyAccessedItemsComponent,
    ],
    providers: [
        DatePipe,
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [AddonBlockRecentlyAccessedItemsHandlerService],
            useFactory: (handler: AddonBlockRecentlyAccessedItemsHandlerService) => () => {
                CoreBlockDelegate.registerHandler(handler);
                return Promise.resolve();
            },
        },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddonBlockRecentlyAccessedItemsModule {}