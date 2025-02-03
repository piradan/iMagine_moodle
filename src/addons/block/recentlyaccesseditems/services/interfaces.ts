/**
 * Badge interface representing a user's earned badge.
 */
export interface Badge {
    id: number;
    name: string;
    description: string;
    badgeurl: string;
    dateissued: number;
    coursename?: string;
}

/**
 * Certificate interface representing a user's earned certificate.
 */
export interface Certificate {
    id: number;
    name: string;
    downloadurl: string;
    timecreated: number;
    courseid?: number;
}

/**
 * Course progress interface representing a user's progress in a course.
 */
export interface CourseProgress {
    courseid: number;
    courseName: string;
    progress: number;
    completed: boolean;
    completedActivities: number;
    totalActivities: number;
    certificateUrl?: string | null;
}

/**
 * Achievement interface representing a user's achievement.
 */
export interface Achievement {
    id: number;
    title: string;
    description: string;
    date: number;
    icon: string;
    courseid?: number;
    moduleid?: number;
}

/**
 * Web service response interfaces
 */
export interface WSBadgeResponse {
    badges: {
        id: number;
        name: string;
        description: string;
        badgeurl: string;
        dateissued: number;
        coursefullname?: string;
    }[];
}

export interface WSCertificateResponse {
    certificates: {
        id: number;
        name: string;
        downloadurl: string;
        timecreated: number;
        courseid?: number;
    }[];
}

export interface WSCourseProgressResponse {
    courses: {
        id: number;
        fullname: string;
        progress: number;
        completed: boolean;
        completedactivities: number;
        totalactivities: number;
    }[];
}

export interface WSAchievementResponse {
    achievements: {
        id: number;
        title: string;
        description: string;
        timecreated: number;
        icon: string;
        courseid?: number;
        cmid?: number;
    }[];
}

/**
 * Completion tracking constants
 */
export const enum CompletionTracking {
    NONE = 0,
    MANUAL = 1,
    AUTOMATIC = 2
}

export const enum CompletionStatus {
    INCOMPLETE = 0,
    COMPLETE = 1
}
