import { Component, OnInit } from '@angular/core';
import { CoreBlockBaseComponent } from '@features/block/classes/base-block-component';
import { AddonRecentlyAccessedItemsService } from '../../services/recentlyaccesseditems';
import { Badge, Certificate, CourseProgress, Achievement } from '../../services/interfaces';

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

    constructor() {
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
            const [badges, courseProgress, achievements, certificates] = await Promise.all([
                AddonRecentlyAccessedItems.instance.getBadges(),
                AddonRecentlyAccessedItems.instance.getCourseProgress(),
                AddonRecentlyAccessedItems.instance.getAchievements(),
                AddonRecentlyAccessedItems.instance.getCertificates(), // Retrieve certificates
            ]);

            this.badges = badges;
            this.courseProgress = courseProgress;
            this.achievements = achievements;
            this.certificates = certificates; // Assign certificates
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