import { Injectable } from '@angular/core';
import { CoreSites } from '@services/sites';
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

interface Badge {
    name: string;
    description: string;
    badgeurl: string;
    dateissued: Date;
    coursename?: string;
}

interface CourseProgress {
    courseName: string;
    courseId: number;
    progress: number;
    completed: boolean;
    totalActivities: number;
    completedActivities: number;
    certificateUrl: string | null; // Allow string or null
}

interface Achievement {
    title: string;
    description: string;
    icon: string;
    date: Date;
}

interface WSBadgeResponse {
    badges: {
        name: string;
        description: string;
        badgeurl: string;
        dateissued: number;
        coursefullname?: string;
    }[];
}

interface WSCourseResponse {
    id: number;
    fullname: string;
}

interface WSActivityResponse {
    statuses: {
        name: string;
        modname: string;
        timecompleted?: number;
    }[];
}

interface Certificate {
    id: number;
    name: string;
    downloadurl: string;
}

@Injectable({ providedIn: 'root' })
export class AddonRecentlyAccessedItemsService {

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
            const response = await site.read<WSBadgeResponse>('core_badges_get_user_badges', {
                userid: site.getUserId()
            });
            return (response.badges || []).map(badge => ({
                name: badge.name,
                description: badge.description,
                badgeurl: badge.badgeurl,
                dateissued: new Date(badge.dateissued * 1000),
                coursename: badge.coursefullname
            }));
        } catch (error) {
            console.error('Error getting badges', error);
            return [];
        }
    }

    async getCourseProgress(): Promise<CourseProgress[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            return [];
        }

        try {
            const [courses, userCertificates] = await Promise.all([
                CoreCourses.getUserCourses(),
                this.getCertificates(), // Reuse existing method
            ]);

            return Promise.all(courses.map(async course => {
                try {
                    // Get the raw completion data directly from Moodle
                    const completion = await site.read<{
                        completiondata: {
                            complete: boolean;
                            completedactivities: number[];
                            totalactivities: number[];
                        };
                    }>('core_completion_get_course_completion_status', {
                        courseid: course.id,
                        userid: site.getUserId()
                    });

                    // Count actual completed activities
                    const totalActivities = completion.completiondata?.totalactivities?.length || 0;
                    const completedActivities = completion.completiondata?.completedactivities?.length || 0;
                    
                    // Calculate percentage
                    const progress = totalActivities > 0 
                        ? Math.round((completedActivities / totalActivities) * 100)
                        : 0;

                    const courseProgress: CourseProgress = {
                        courseName: course.fullname,
                        courseId: course.id,
                        progress,
                        completed: completion.completiondata?.complete || false,
                        totalActivities,
                        completedActivities,
                        certificateUrl: null, // Default
                    };

                    // Match a certificate for this course if available
                    const match = userCertificates.find(cert => {
                        // Logic to determine course match:
                        // e.g., “cert.coursemoduleid” or custom approach from response
                        // If your cert data doesn't store course ID, you might need to adapt WS or data.
                        return cert.name.includes(course.fullname); 
                    });
                    if (match) {
                        courseProgress.certificateUrl = match.downloadurl || null; // Ensure valid assignment
                    }

                    return courseProgress;
                } catch (error) {
                    console.error(`Error getting completion for course ${course.id}:`, error);
                    return this.createEmptyCourseProgress(course);
                }
            }));
        } catch (error) {
            console.error('Error getting course progress:', error);
            return [];
        }
    }

    private createEmptyCourseProgress(course: WSCourseResponse): CourseProgress {
        return {
            courseName: course.fullname,
            courseId: course.id,
            progress: 0,
            completed: false,
            totalActivities: 0,
            completedActivities: 0,
            certificateUrl: null, // Default
        };
    }

    async getAchievements(): Promise<Achievement[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            return [];
        }
        
        try {
            const courses = await site.read<WSCourseResponse[]>('core_enrol_get_users_courses', {
                userid: site.getUserId()
            });
            
            const achievements: Achievement[] = [];
            
            await Promise.all(courses.map(async course => {
                try {
                    const activities = await site.read<WSActivityResponse>('core_completion_get_activities_completion_status', {
                        courseid: course.id,
                        userid: site.getUserId()
                    });
                    
                    activities.statuses?.forEach(status => {
                        if (status.timecompleted) {
                            achievements.push({
                                title: status.name,
                                description: `Completed in ${course.fullname}`,
                                icon: this.getModuleIcon(status.modname),
                                date: new Date(status.timecompleted * 1000)
                            });
                        }
                    });
                } catch (error) {
                    console.error(`Error getting activities for course ${course.id}:`, error);
                }
            }));

            return achievements
                .sort((a, b) => b.date.getTime() - a.date.getTime())
                .slice(0, 4); // Limit to 4 items
        } catch (error) {
            console.error('Error getting achievements:', error);
            return [];
        }
    }

    async getCertificates(): Promise<Certificate[]> {
        const site = CoreSites.getCurrentSite();
        if (!site) {
            return [];
        }

        try {
            const userId = site.getUserId();

            // Example: Using a Moodle WS for customcert
            const response = await site.read<{
                certificates: {
                    id: number;
                    name: string;
                    coursemoduleid: number;
                }[];
            }>('mod_customcert_get_issued_certificates', { userid: userId });

            // Build final list of certificates with direct download links
            return (response.certificates || []).map(cert => ({
                id: cert.id,
                name: cert.name,
                downloadurl: `${site.getURL()}/mod/customcert/view.php?id=${cert.coursemoduleid}&downloadown=1`
            }));
        } catch (error) {
            console.error('Error retrieving user certificates:', error);
            return [];
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
}

export const AddonRecentlyAccessedItems = makeSingleton(AddonRecentlyAccessedItemsService);