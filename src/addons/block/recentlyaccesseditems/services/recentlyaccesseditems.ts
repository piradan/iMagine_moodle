import { Injectable } from '@angular/core';
import { CoreSites } from '@services/sites';
import { CoreWSExternalWarning } from '@services/ws';
import { makeSingleton } from '@singletons';

interface Badge {
   name: string;
   description: string;
   badgeurl: string;
   dateissued: Date;
   coursename?: string;
}

interface Certificate {
   coursename: string;
   dateissued: Date; 
   certificateurl: string;
}

interface CourseProgress {
   courseName: string;
   courseId: number;
   progress: number;
   completed: boolean;
   totalActivities: number;
   completedActivities: number;
}

interface Achievement {
   title: string;
   description: string;
   date: Date;
   icon: string;
}

@Injectable({ providedIn: 'root' })
export class AddonRecentlyAccessedItemsService {

   constructor() {
       // Initialize service
   }

   async getBadges(): Promise<Badge[]> {
       const site = CoreSites.getCurrentSite();
       if (!site) {
           return [];
       }

       try {
           const data: any = await site.read('core_badges_get_user_badges', {
               userid: site.getUserId()
           });
           
           return (data.badges || []).map((badge: any) => ({
               name: badge.name,
               description: badge.description,
               badgeurl: badge.badgeurl,
               dateissued: new Date(badge.dateissued * 1000),
               coursename: badge.coursename
           }));
       } catch (error) {
           console.error('Error fetching badges:', error);
           return [];
       }
   }

   async getCertificates(): Promise<Certificate[]> {
       const site = CoreSites.getCurrentSite();
       if (!site) {
           return [];
       }

       try {
           const data: any = await site.read('mod_certificate_get_user_certificates', {
               userid: site.getUserId()
           });
           
           return (data.certificates || []).map((cert: any) => ({
               coursename: cert.coursename,
               dateissued: new Date(cert.timecreated * 1000),
               certificateurl: cert.fileurl
           }));
       } catch (error) {
           console.error('Error fetching certificates:', error);
           return [];
       }
   }

   async getCourseProgress(): Promise<CourseProgress[]> {
       const site = CoreSites.getCurrentSite();
       if (!site) {
           return [];
       }

       try {
           const data: any = await site.read('core_completion_get_course_completion_status', {
               userid: site.getUserId()
           });
           
           return (data.completions || []).map((course: any) => ({
               courseName: course.coursename,
               courseId: course.courseid,
               progress: this.calculateProgress(course.completions),
               completed: course.completed,
               totalActivities: course.totalitems,
               completedActivities: course.completeditems
           }));
       } catch (error) {
           console.error('Error fetching course progress:', error);
           return [];
       }
   }

   async getAchievements(): Promise<Achievement[]> {
       const site = CoreSites.getCurrentSite();
       if (!site) {
           return [];
       }

       try {
           const data: any = await site.read('local_achievements_get_user_achievements', {
               userid: site.getUserId(),
               limit: 5
           });
           
           return (data.achievements || []).map((achievement: any) => ({
               title: achievement.name,
               description: achievement.description,
               date: new Date(achievement.timeearned * 1000),
               icon: this.getAchievementIcon(achievement.type)
           }));
       } catch (error) {
           console.error('Error fetching achievements:', error);
           return [];
       }
   }

   private calculateProgress(completions: any[]): number {
       if (!completions?.length) {
           return 0;
       }
       const completed = completions.filter(c => c.completed).length;
       return Math.round((completed / completions.length) * 100);
   }

   private getAchievementIcon(type: string): string {
       const icons: {[key: string]: string} = {
           'enrollment': 'school',    // For course enrollments
           'completion': 'trophy',    // For course completions
           'grade': 'ribbon',        // For grade achievements 
           'login': 'log-in',        // For first login
           'activity': 'star',       // For activity completions
           'badge': 'medal',         // For badge awards
           'default': 'award'        // Default icon
       };
       return icons[type] || icons.default;
   }
}

export const AddonRecentlyAccessedItems = makeSingleton(AddonRecentlyAccessedItemsService);