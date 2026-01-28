import crypto from 'crypto';

/**
 * Generate random string
 */
export function randomString(length: number = 16): string {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

/**
 * Generate UUID v4
 */
export function generateUUID(): string {
    return crypto.randomUUID();
}

/**
 * Get client IP from request
 */
export function getClientIP(req: any): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return (forwarded as string).split(',')[0].trim();
    }
    return req.ip || req.connection?.remoteAddress || '';
}

/**
 * Format money with Thai Baht
 */
export function formatMoney(amount: number | string, decimals: number = 2): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `฿${num.toLocaleString('th-TH', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
}

/**
 * Format Thai date
 */
export function formatThaiDate(date: Date | string, showTime: boolean = false): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ];

    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const year = d.getFullYear() + 543;

    let result = `${day} ${month} ${year}`;

    if (showTime) {
        const hours = d.getHours().toString().padStart(2, '0');
        const minutes = d.getMinutes().toString().padStart(2, '0');
        result += ` ${hours}:${minutes}`;
    }

    return result;
}

/**
 * Time ago in Thai
 */
export function timeAgo(datetime: Date | string): string {
    const date = typeof datetime === 'string' ? new Date(datetime) : datetime;
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return 'เมื่อสักครู่';
    if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)} นาทีที่แล้ว`;
    if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)} ชั่วโมงที่แล้ว`;
    if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)} วันที่แล้ว`;
    if (diffSeconds < 2592000) return `${Math.floor(diffSeconds / 604800)} สัปดาห์ที่แล้ว`;
    if (diffSeconds < 31536000) return `${Math.floor(diffSeconds / 2592000)} เดือนที่แล้ว`;
    return `${Math.floor(diffSeconds / 31536000)} ปีที่แล้ว`;
}

/**
 * Sleep helper
 */
export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Mask sensitive data (e.g., phone number, bank account)
 */
export function maskString(str: string, visibleStart: number = 3, visibleEnd: number = 3): string {
    if (str.length <= visibleStart + visibleEnd) return str;
    const start = str.substring(0, visibleStart);
    const end = str.substring(str.length - visibleEnd);
    const masked = '*'.repeat(str.length - visibleStart - visibleEnd);
    return `${start}${masked}${end}`;
}
