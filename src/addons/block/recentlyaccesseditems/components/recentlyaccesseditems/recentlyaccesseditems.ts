import { Component, OnInit } from '@angular/core';
import { CoreBlockBaseComponent } from '@features/block/classes/base-block-component';
import { CoreSites } from '@services/sites';
import { AddonRecentlyAccessedItemsService } from '../../services/recentlyaccesseditems';

@Component({
    selector: 'addon-block-recentlyaccesseditems',
    templateUrl: './addon-block-recentlyaccesseditems.html',
    styleUrls: ['./recentlyaccesseditems.scss'],
})
export class AddonBlockRecentlyAccessedItemsComponent extends CoreBlockBaseComponent implements OnInit {
    badges: any[] = [];
    certificates: any[] = [];
    courseProgress: any[] = [];
    achievements: any[] = [];
    nprStreamUrl = 'https://www.npr.org/streams/';
    loaded = false;

    constructor(
        private recentlyAccessedItemsService: AddonRecentlyAccessedItemsService
    ) {
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
            this.badges = await this.recentlyAccessedItemsService.getBadges();
            this.certificates = await this.recentlyAccessedItemsService.getCertificates();
            this.courseProgress = await this.recentlyAccessedItemsService.getCourseProgress();
            this.achievements = await this.recentlyAccessedItemsService.getAchievements();
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
            await this.loadContent();
        } finally {
            refresher?.complete();
        }
    }
}