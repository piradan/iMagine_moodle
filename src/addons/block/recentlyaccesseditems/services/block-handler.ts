import { Injectable } from '@angular/core';
import { CoreBlockHandler } from '@features/block/services/block-delegate';
import { makeSingleton } from '@singletons';
import { AddonBlockRecentlyAccessedItemsComponent } from '../components/recentlyaccesseditems/recentlyaccesseditems';

@Injectable({ providedIn: 'root' })
export class AddonBlockRecentlyAccessedItemsHandlerService implements CoreBlockHandler {
    name = 'AddonBlockRecentlyAccessedItems';
    blockName = 'recentlyaccesseditems';
    displayName = 'Student Progress';

    async isEnabled(): Promise<boolean> {
        return true;
    }

    getDisplayData() {
        return {
            title: this.displayName,
            class: 'addon-block-recentlyaccesseditems',
            component: AddonBlockRecentlyAccessedItemsComponent,
        };
    }
}

export const AddonBlockRecentlyAccessedItemsHandler = makeSingleton(AddonBlockRecentlyAccessedItemsHandlerService);