import { Injectable } from '@angular/core';
import { CoreBlockHandler } from '@features/block/services/block-delegate';
import { CoreSites } from '@services/sites';
import { makeSingleton } from '@singletons';
import { AddonBlockRecentlyAccessedItemsComponent } from '../components/recentlyaccesseditems/recentlyaccesseditems';

/**
 * Block handler.
 */
@Injectable({ providedIn: 'root' })
export class AddonBlockRecentlyAccessedItemsHandlerService implements CoreBlockHandler {
    name = 'AddonBlockRecentlyAccessedItems';
    blockName = 'recentlyaccesseditems';
    displayName = 'Student Progress';

    /**
     * Returns the data needed to render the block.
     *
     * @param block The block to render.
     * @returns Data or promise resolved with the data.
     */
    getDisplayData() {
        return {
            title: this.displayName,
            class: 'addon-block-recentlyaccesseditems',
            component: AddonBlockRecentlyAccessedItemsComponent,
        };
    }

    /**
     * Whether or not the handler is enabled on a site level.
     *
     * @returns True or promise resolved with true if enabled.
     */
    async isEnabled(): Promise<boolean> {
        return true;
    }
}

/**
 * Singleton service instance.
 */
export const AddonBlockRecentlyAccessedItemsHandler = makeSingleton(AddonBlockRecentlyAccessedItemsHandlerService);