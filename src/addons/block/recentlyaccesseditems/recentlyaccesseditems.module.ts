import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CoreBlockDelegate } from '@features/block/services/block-delegate';
import { AddonBlockRecentlyAccessedItemsHandler } from './services/block-handler';
import { AddonBlockRecentlyAccessedItemsComponent } from './components/recentlyaccesseditems/recentlyaccesseditems';
import { CoreSharedModule } from '@/core/shared.module';
import { CommonModule } from '@angular/common';
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
        {
            provide: APP_INITIALIZER,
            multi: true,
            deps: [],
            useFactory: () => async () => {
                CoreBlockDelegate.registerHandler(AddonBlockRecentlyAccessedItemsHandler.instance);
                return Promise.resolve();
            },
        },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddonBlockRecentlyAccessedItemsModule {}