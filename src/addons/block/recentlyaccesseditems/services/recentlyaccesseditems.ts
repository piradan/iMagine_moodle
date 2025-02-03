import { Injectable } from '@angular/core';
import { CoreSites } from '@services/sites';
import { makeSingleton } from '@singletons';
import { Badge, Certificate, CourseProgress, Achievement } from './interfaces';

@Injectable({ providedIn: 'root' })
export class AddonRecentlyAccessedItemsService {

    protected cache = {
        badges: [] as Badge[],
        certificates: [] as Certificate[],
        courseProgress: [] as CourseProgress[],
        achievements: [] as Achievement[],
    };

    /**
     * Get user badges.
     *
     * @returns Promise resolved with badges.
     */
    async getBadges(): Promise<Badge[]> {
        // TODO: Implement actual API call
        return this.cache.badges;
    }

    /**
     * Get certificates.
     *
     * @returns Promise resolved with certificates.
     */
    async getCertificates(): Promise<Certificate[]> {
        // TODO: Implement actual API call
        return this.cache.certificates;
    }

    /**
     * Get course progress.
     *
     * @returns Promise resolved with course progress.
     */
    async getCourseProgress(): Promise<CourseProgress[]> {
        // TODO: Implement actual API call
        return this.cache.courseProgress;
    }

    /**
     * Get achievements.
     *
     * @returns Promise resolved with achievements.
     */
    async getAchievements(): Promise<Achievement[]> {
        // TODO: Implement actual API call
        return this.cache.achievements;
    }

    /**
     * Invalidate cache.
     *
     * @returns Promise resolved when done.
     */
    async invalidateCache(): Promise<void> {
        this.cache = {
            badges: [],
            certificates: [],
            courseProgress: [],
            achievements: [],
        };
        
        // TODO: Implement actual cache invalidation for the API calls
    }
}

export const AddonRecentlyAccessedItemsInstance = makeSingleton(AddonRecentlyAccessedItemsService);