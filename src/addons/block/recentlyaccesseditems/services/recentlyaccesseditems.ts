import { Injectable } from '@angular/core';
import { CoreSites } from '@services/sites';
import { CoreWSError } from '@classes/errors/wserror';
import { makeSingleton } from '@singletons';

// Response interfaces
interface BadgesResponse {
    badges: {
        id: number;
        name: string;
        description: string;
        badgeurl: string;
        dateissued: number;
        uniquehash: string;
    }[];
}

interface CourseProgressResponse {
    courses: {
        id: number;
        fullname: string;
        progress: number;
        completedactivities: number;
        totalactivities: number;
        certificateurl?: string;
    }[];
}

interface CertificatesResponse {
    certificates: {
        id: number;
        name: string;
        downloadurl: string;
        timecreated: number;
    }[];
}

interface AchievementsResponse {
    achievements: {
        id: number;
        title: string;
        description: string;
        timecreated: number;
        icon: string;
    }[];
}

export interface Badge {
    id: number;
    name: string;
    description: string;
    badgeurl: string;
    dateissued: number;
    uniquehash: string;
}

export interface Certificate {
    id: number;
    name: string;
    downloadurl: string;
    timecreated: number;
}

export interface CourseProgress {
    courseid: number;
    courseName: string;
    progress: number;
    completedActivities: number;
    totalActivities: number;
    certificateUrl?: string;
}

export interface Achievement {
    id: number;
    title: string;
    description: string;
    date: number;
    icon: string;
}

@Injectable({
    providedIn: 'root'
})
export class AddonRecentlyAccessedItemsService {
    static readonly ROOT_CACHE_KEY = 'moodleapp:recentlyaccesseditems:';

    async getBadges(): Promise<any[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            throw new CoreWSError({ message: 'Site not found', errorcode: 'siteerror' });
        }

        const result = await site.read<{ badges: any[] }>('core_badges_get_user_badges', {
            userid: site.getUserId()
        });

        return result.badges || [];
    }

    async getCourseProgress(): Promise<any[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            throw new CoreWSError({
                message: 'Site not found',
                errorcode: 'siteerror'
            });
        }

        try {
            const response = await site.read<CourseProgressResponse>('core_completion_get_progress', {
                userid: site.getUserId()
            });

            return response.courses.map(course => ({
                courseid: course.id,
                courseName: course.fullname,
                progress: course.progress,
                completedActivities: course.completedactivities,
                totalActivities: course.totalactivities,
                certificateUrl: course.certificateurl
            }));
        } catch (error) {
            throw new CoreWSError(error);
        }
    }

    async getCertificates(): Promise<any[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            throw new CoreWSError({
                message: 'Site not found',
                errorcode: 'siteerror'
            });
        }

        const params = {
            userid: site.getUserId()
        };

        try {
            const response = await site.read<CertificatesResponse>('tool_certificate_get_user_certificates', params);
            return response.certificates.map((cert: any) => ({
                id: cert.id,
                name: cert.name,
                downloadurl: cert.downloadurl,
                timecreated: cert.timecreated
            }));
        } catch (error) {
            throw new CoreWSError(error);
        }
    }

    async getAchievements(): Promise<any[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            throw new CoreWSError({
                message: 'Site not found',
                errorcode: 'siteerror'
            });
        }

        const params = {
            userid: site.getUserId()
        };

        try {
            const response = await site.read<AchievementsResponse>('local_achievements_get_user_achievements', params);
            return response.achievements.map((achievement: any) => ({
                id: achievement.id,
                title: achievement.title,
                description: achievement.description,
                date: achievement.timecreated,
                icon: achievement.icon || 'trophy'
            }));
        } catch (error) {
            throw new CoreWSError(error);
        }
    }

    async invalidateCache(): Promise<void> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            return;
        }
        await site.invalidateWsCacheForKey(AddonRecentlyAccessedItemsService.ROOT_CACHE_KEY);
    }
}

export const AddonRecentlyAccessedItems = makeSingleton(AddonRecentlyAccessedItemsService);