export interface Badge {
    id: number;
    name: string;
    description: string;
    badgeurl: string;
    dateissued: number;
    coursename?: string;
}

export interface Certificate {
    id: number;
    name: string;
    downloadurl: string;
    timecreated: number;
    courseid?: number;
}

export interface CourseProgress {
    id: number;
    fullname: string;
    progress: number;
    completedactivities: number;
    totalactivities: number;
}

export interface Achievement {
    id: number;
    description: string;
    date: number;
    moduleicon: string;
    modulename: string;
    value?: string;
}

export interface WSBadgesResponse {
    badges: Badge[];
    warnings?: any[];
}

export interface WSCertificatesResponse {
    certificates: Certificate[];
    warnings?: any[];
}

export interface WSCourseProgressResponse {
    courses: CourseProgress[];
    warnings?: any[];
}

export interface WSAchievementsResponse {
    achievements: Achievement[];
    warnings?: any[];
}
