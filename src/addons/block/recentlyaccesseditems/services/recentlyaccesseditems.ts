import { Injectable } from '@angular/core';
import { CoreSites } from '@services/sites';
import { makeSingleton } from '@singletons';
import { 
    Badge, Certificate, CourseProgress, Achievement,  
    WSBadgesResponse, WSCertificatesResponse, 
    WSCourseProgressResponse, WSAchievementsResponse 
} from './interfaces';

@Injectable({ providedIn: 'root' })
export class AddonRecentlyAccessedItemsService {

    /**
     * Get user badges using core_badges_get_user_badges.
     */
    async getBadges(): Promise<Badge[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            throw new Error('Site not found');
        }

        const response: WSBadgesResponse = await site.read('core_badges_get_user_badges', {
            userid: site.getUserId()
        });

        return response.badges;
    }

    /**
     * Get user certificates using mod_certificate_get_user_certificates.
     */
    async getCertificates(): Promise<Certificate[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            throw new Error('Site not found');
        }

        const response: WSCertificatesResponse = await site.read('mod_certificate_get_user_certificates', {
            userid: site.getUserId()
        });

        return response.certificates;
    }

    /**
     * Get course progress using core_completion_get_course_completion_status.
     */
    async getCourseProgress(): Promise<CourseProgress[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            throw new Error('Site not found');
        }

        const response: WSCourseProgressResponse = await site.read('core_completion_get_course_completion_status', {
            userid: site.getUserId()
        });

        return response.courses;
    }

    /**
     * Get achievements by combining activity completions and grades.
     */
    async getAchievements(): Promise<Achievement[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            throw new Error('Site not found');
        }

        const response: WSAchievementsResponse = await site.read('core_completion_get_activities_completion_status', {
            userid: site.getUserId()
        });

        return response.achievements;
    }

    /**
     * Invalidate the cache for all data.
     */
    async invalidateCache(): Promise<void> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            return;
        }

        await Promise.all([
            site.invalidateWsCacheForKey('badges'),
            site.invalidateWsCacheForKey('certificates'),
            site.invalidateWsCacheForKey('courseprogress'),
            site.invalidateWsCacheForKey('achievements')
        ]);
    }
}

export const AddonRecentlyAccessedItemsInstance = makeSingleton(AddonRecentlyAccessedItemsService);