import { Injectable } from '@angular/core';
import { CoreBlockHandler } from '@features/block/services/block-delegate';
import { CoreSites } from '@services/sites';
import { makeSingleton } from '@singletons';
import { AddonBlockRecentlyAccessedItemsComponent } from '../components/recentlyaccesseditems/recentlyaccesseditems';
import { Component, OnInit } from '@angular/core';
import { CoreBlockBaseComponent } from '@features/block/classes/base-block-component';
import { Badge, CourseProgress, Achievement, Certificate } from '@features/block/services/block-delegate';
import { AddonRecentlyAccessedItems } from '@features/block/services/recentlyaccesseditems';

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

@Component({
    selector: 'addon-block-recentlyaccesseditems',
    templateUrl: './addon-block-recentlyaccesseditems.html',
    styleUrls: ['./recentlyaccesseditems.scss'],
})
export class AddonBlockRecentlyAccessedItemsComponent extends CoreBlockBaseComponent implements OnInit {
    badges: Badge[] = []; // Add type
    courseProgress: CourseProgress[] = []; // Add type  
    achievements: Achievement[] = []; // Add type
    certificates: Certificate[] = []; // Add type
    loaded = false;

    constructor() {
        super('AddonBlockRecentlyAccessedItemsComponent');
    }

    async ngOnInit(): Promise<void> {
        try {
            await this.loadContent();
        } finally {
            this.loaded = true;
        }
    }

    protected async loadContent(): Promise<void> {
        try {
            const [badges, courseProgress, achievements, certificates] = await Promise.all([
                AddonRecentlyAccessedItems.instance.getBadges(),
                AddonRecentlyAccessedItems.instance.getCourseProgress(), 
                AddonRecentlyAccessedItems.instance.getAchievements(),
                AddonRecentlyAccessedItems.instance.getCertificates()
            ]);

            this.badges = badges;
            this.courseProgress = courseProgress;
            this.achievements = achievements; 
            this.certificates = certificates;
        } catch (error) {
            console.error('Error loading student progress data', error);
            throw error;
        }
    }

    async doRefresh(refresher?: any): Promise<void> {
        try {
            await this.loadContent();
        } finally {
            refresher?.complete();
        }
    }
}