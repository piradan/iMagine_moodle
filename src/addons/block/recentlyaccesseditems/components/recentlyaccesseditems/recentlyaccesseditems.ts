import { Component, OnInit } from '@angular/core';
import { CoreBlockBaseComponent } from '@features/block/classes/base-block-component';
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

    constructor(private recentlyAccessedItems: AddonRecentlyAccessedItemsService) {
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
                this.recentlyAccessedItems.getBadges(),
                this.recentlyAccessedItems.getCourseProgress(),
                this.recentlyAccessedItems.getAchievements(),
                this.recentlyAccessedItems.getCertificates(),
            ]);

            console.log('Badges', badges);
            console.log('Course progress', courseProgress);
            console.log('Achievements', achievements);
            console.log('Certificates', certificates);

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

    /**
     * @inheritdoc
     */
    async invalidateContent(): Promise<void> {
        // Add your invalidation logic here
        // For example:
        try {
            await this.recentlyAccessedItems.invalidateCache();
        } catch (error) {
            console.error('Error invalidating content', error);
            throw error;
        }
    }
}