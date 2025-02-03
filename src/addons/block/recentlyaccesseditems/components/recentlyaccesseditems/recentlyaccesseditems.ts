import { Component, OnInit } from '@angular/core';
import { CoreBlockBaseComponent } from '@features/block/classes/base-block-component';
import { Badge, Certificate, CourseProgress, Achievement } from '../../services/interfaces';
import { AddonRecentlyAccessedItemsService } from '../../services/recentlyaccesseditems';

@Component({
    selector: 'addon-block-recentlyaccesseditems',
    templateUrl: './addon-block-recentlyaccesseditems.html',
    styleUrls: ['./recentlyaccesseditems.scss']
})
export class AddonBlockRecentlyAccessedItemsComponent extends CoreBlockBaseComponent implements OnInit {

    badges: Badge[] = [];
    certificates: Certificate[] = [];
    courseProgress: CourseProgress[] = [];
    achievements: Achievement[] = [];
    loaded = false;

    constructor(private recentItemsService: AddonRecentlyAccessedItemsService) {
        super('AddonBlockRecentlyAccessedItemsComponent');
    }

    /**
     * Component initialization.
     */
    async ngOnInit(): Promise<void> {
        try {
            await this.loadContent();
        } finally {
            this.loaded = true;
        }
    }

    /**
     * Load all content.
     */
    protected async loadContent(): Promise<void> {
        try {
            const [badges, certificates, progress, achievements] = await Promise.all([
                this.recentItemsService.getBadges(),
                this.recentItemsService.getCertificates(),
                this.recentItemsService.getCourseProgress(),
                this.recentItemsService.getAchievements()
            ]);

            this.badges = badges;
            this.certificates = certificates;
            this.courseProgress = progress;
            this.achievements = achievements;
        } catch (error) {
            console.error('Error loading student progress data:', error);
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