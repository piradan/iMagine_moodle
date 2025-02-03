import { Injectable } from '@angular/core';
import { CoreSites } from '@services/sites';
import { CoreWSError } from '@classes/errors/wserror';
import { makeSingleton } from '@singletons';
import { CoreCourse } from '@features/course/services/course';
import { CoreCourses } from '@features/courses/services/courses';
import { CoreCourseHelper } from '@features/course/services/course-helper';
import { CoreCourseModuleDelegate } from '@features/course/services/module-delegate';

// Constants for completion tracking
const COMPLETION_TRACKING_NONE = 0;
const COMPLETION_TRACKING_MANUAL = 1;
const COMPLETION_TRACKING_AUTOMATIC = 2;
const COMPLETION_INCOMPLETE = 0;
const COMPLETION_COMPLETE = 1;

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

interface PluginResponse {
    plugins: {
        addon: string;
        version: string;
    }[];
}

interface CompletionResponse {
    completedpercentage: number;
    completed: number;
    total: number;
}

interface CustomCertResponse {
    certificates: {
        id: number;
        name: string;
        cmid: number;
        issueid: number;
        timecreated: number;
    }[];
}

interface StandardCertResponse {
    certificates: {
        id: number;
        name: string;
        cmid: number;
        timecreated: number;
    }[];
}

interface WSCourse {
    id: number;
    fullname: string;
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

    async getRecentItems(): Promise<any[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            return [];
        }
        return site.read('block_recentlyaccesseditems_get_recent_items', {});
    }

    async getBadges(): Promise<Badge[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            return [];
        }

        try {
            console.log('Fetching badges for user:', site.getUserId());
            const response = await site.read<BadgesResponse>('core_badges_get_user_badges', {
                userid: site.getUserId()
            });
            console.log('Badges response:', response);

            return (response.badges || []).map(badge => ({
                id: badge.id,
                name: badge.name,
                description: badge.description,
                badgeurl: badge.badgeurl,
                dateissued: badge.dateissued,
                uniquehash: badge.uniquehash
            }));
        } catch (error) {
            console.error('Error fetching badges:', error);
            return [];
        }
    }

    async getCourseProgress(): Promise<CourseProgress[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            return [];
        }

        try {
            // Get enrolled courses first
            const courses = await CoreCourses.getUserCourses();
            console.log('User courses:', courses);

            const progress = await Promise.all(courses.map(async course => {
                try {
                    // Get completion status for each course
                    const completion = await site.read<CompletionResponse>('core_completion_get_course_completion_status', {
                        courseid: course.id,
                        userid: site.getUserId()
                    });
                    console.log(`Course ${course.id} completion:`, completion);

                    return {
                        courseid: course.id,
                        courseName: course.fullname,
                        progress: completion.completedpercentage || 0,
                        completedActivities: completion.completed || 0,
                        totalActivities: completion.total || 0,
                    };
                } catch (err) {
                    console.error(`Error getting completion for course ${course.id}:`, err);
                    return null;
                }
            }));

            return progress.filter((p): p is CourseProgress => p !== null);
        } catch (error) {
            console.error('Error getting course progress:', error);
            return [];
        }
    }

    private createEmptyCourseProgress(course: WSCourse): CourseProgress {
        return {
            courseid: course.id,
            courseName: course.fullname,
            progress: 0,
            completedActivities: 0,
            totalActivities: 0,
        };
    }

    async getCertificates(): Promise<Certificate[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            return [];
        }

        try {
            // Try custom certificate first
            try {
                const customCerts = await site.read<CustomCertResponse>('mod_customcert_get_issued_certificates', {
                    userid: site.getUserId()
                });
                console.log('Custom certificates:', customCerts);
                if (customCerts?.certificates?.length) {
                    return customCerts.certificates.map(cert => ({
                        id: cert.id,
                        name: cert.name,
                        downloadurl: `${site.getURL()}/mod/customcert/view.php?id=${cert.cmid}&downloadissue=${cert.issueid}`,
                        timecreated: cert.timecreated
                    }));
                }
            } catch (e) {
                console.log('Custom certificates not available:', e);
            }

            // Fallback to standard certificate
            const response = await site.read<StandardCertResponse>('mod_certificate_get_user_certificates', {
                userid: site.getUserId()
            });
            console.log('Standard certificates:', response);

            return (response.certificates || []).map(cert => ({
                id: cert.id,
                name: cert.name,
                downloadurl: `${site.getURL()}/mod/certificate/view.php?id=${cert.cmid}&action=get`,
                timecreated: cert.timecreated
            }));
        } catch (error) {
            console.error('Error fetching certificates:', error);
            return [];
        }
    }

    async getAchievements(): Promise<Achievement[]> {
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

    private getModuleIcon(modname: string): string {
        const icons: Record<string, string> = {
            assign: 'document-text',
            quiz: 'help-circle',
            forum: 'chatbubbles',
            resource: 'document',
            default: 'checkmark-circle'
        };
        return icons[modname] || icons.default;
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