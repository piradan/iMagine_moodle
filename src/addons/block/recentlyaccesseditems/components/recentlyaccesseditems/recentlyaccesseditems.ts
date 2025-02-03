import { Component, OnInit } from '@angular/core';
import { CoreBlockBaseComponent } from '@features/block/classes/base-block-component';
import { AddonRecentlyAccessedItemsService } from '../../services/recentlyaccesseditems';

@Component({
    selector: 'addon-block-recentlyaccesseditems',
    templateUrl: './addon-block-recentlyaccesseditems.html',
    styleUrls: ['./recentlyaccesseditems.scss']
})
export class AddonBlockRecentlyAccessedItemsComponent extends CoreBlockBaseComponent implements OnInit {

    badges: any[] = [];
    certificates: any[] = [];
    courseProgress: any[] = [];
    achievements: any[] = [];
    loaded = false;

    constructor(private recentlyAccessedItemsService: AddonRecentlyAccessedItemsService) {
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
            const [badges, certificates, courseProgress, achievements] = await Promise.all([
                this.recentlyAccessedItemsService.getBadges(),
                this.recentlyAccessedItemsService.getCertificates(),
                this.recentlyAccessedItemsService.getCourseProgress(),
                this.recentlyAccessedItemsService.getAchievements(),
            ]);

            this.badges = badges;
            this.certificates = certificates;
            this.courseProgress = courseProgress;
            this.achievements = achievements;
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