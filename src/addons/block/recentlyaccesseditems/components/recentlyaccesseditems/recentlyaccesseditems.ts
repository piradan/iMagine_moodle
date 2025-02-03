import { Component, OnInit } from '@angular/core';
import { CoreBlockBaseComponent } from '@features/block/classes/base-block-component';
import { CoreSites } from '@services/sites';
import { Badge, Certificate, CourseProgress, Achievement } from '../../services/interfaces';
import { makeSingleton } from '@singletons';
import { AddonRecentlyAccessedItemsService } from '../../services/recentlyaccesseditems';

@Component({
    selector: 'addon-block-recentlyaccesseditems',
    templateUrl: './addon-block-recentlyaccesseditems.html',
    styleUrls: ['./recentlyaccesseditems.scss'],
})
export class AddonBlockRecentlyAccessedItemsComponent extends CoreBlockBaseComponent implements OnInit {

    badges: Badge[] = [];
    courseProgress: CourseProgress[] = [];
    achievements: Achievement[] = [];
    certificates: Certificate[] = [];
    loaded = false;

    constructor(private recentItemsService: AddonRecentlyAccessedItemsService) {
        super('AddonBlockRecentlyAccessedItemsComponent');
    }

    /**
     * Component being initialized.
     */
    async ngOnInit(): Promise<void> {
        try {
            await this.loadContent();
        } finally {
            this.loaded = true;
        }
    }

    /**
     * Fetch the data.
     */
    protected async loadContent(): Promise<void> {
        try {
            // Fetch all data in parallel for better performance 
            const site = CoreSites.getCurrentSite();
            if (!site) {
                throw new Error('Site not found');
            }

            const [badges, progress, achievements, certificates] = await Promise.all([
                this.recentItemsService.getBadges(),
                this.recentItemsService.getCourseProgress(),
                this.recentItemsService.getAchievements(),
                this.recentItemsService.getCertificates(),
            ]);

            this.badges = badges;
            this.courseProgress = progress;
            this.achievements = achievements; 
            this.certificates = certificates;
        } catch (error) {
            console.error('Error loading student progress data', error);
            throw error;
        }
    }

    /**
     * Refresh the data.
     *
     * @param refresher Refresher.
     */
    async doRefresh(refresher?: any): Promise<void> {
        try {
            await this.recentItemsService.invalidateCache();
            await this.loadContent();
        } finally {
            refresher?.complete();
        }
    }
}

export const AddonBlockRecentlyAccessedItemsInstance = makeSingleton(AddonBlockRecentlyAccessedItemsComponent);