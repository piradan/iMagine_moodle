import { APP_INITIALIZER, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CoreBlockDelegate } from '@features/block/services/block-delegate';
import { AddonBlockRecentlyAccessedItemsHandler } from './services/block-handler';
import { AddonBlockRecentlyAccessedItemsComponent } from './components/recentlyaccesseditems/recentlyaccesseditems';
import { CoreSharedModule } from '@/core/shared.module';
import { CommonModule } from '@angular/common';
import { CoreComponentsModule } from '@components/components.module';
import { TranslateModule } from '@ngx-translate/core';
import { AddonRecentlyAccessedItemsService } from './services/recentlyaccesseditems';

@NgModule({
    declarations: [
        AddonBlockRecentlyAccessedItemsComponent,
    ],
    imports: [
        IonicModule,
        CoreSharedModule,
        CommonModule,
        CoreComponentsModule,
        TranslateModule.forChild(),
    ],
    exports: [
        AddonBlockRecentlyAccessedItemsComponent,
    ],
    providers: [
        AddonRecentlyAccessedItemsService,
        {
            provide: APP_INITIALIZER,
            multi: true,
            useFactory: () => async () => {
                CoreBlockDelegate.registerHandler(AddonBlockRecentlyAccessedItemsHandler.instance);
            },
        },
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AddonBlockRecentlyAccessedItemsModule {}