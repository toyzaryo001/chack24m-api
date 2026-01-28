import bcrypt from 'bcrypt';
import { prisma } from '../config/database';
import { generateTokens, verifyToken, JwtPayload } from '../middleware/auth';
import { randomString } from '../utils/helpers';
import { logger } from '../utils/logger';

// ============================================
// Types
// ============================================

export interface LoginInput {
    username: string;
    password: string;
    deviceHash?: string;
}

export interface RegisterInput {
    username: string;
    password: string;
    phone?: string;
    fullName?: string;
    bankCode?: string;
    bankAccount?: string;
    referralCode?: string;
}

export interface AuthResult {
    success: boolean;
    message: string;
    user?: {
        id: number;
        username: string;
        phone: string | null;
        balance: string;
    };
    tokens?: {
        accessToken: string;
        refreshToken: string;
    };
}

// ============================================
// Service
// ============================================

const SALT_ROUNDS = 12;

/**
 * User login
 */
export async function login(input: LoginInput): Promise<AuthResult> {
    try {
        const { username, password, deviceHash } = input;

        // Find user
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
        }

        // Check status
        if (user.status === 'banned') {
            return { success: false, message: 'บัญชีถูกระงับการใช้งาน' };
        }

        if (user.status === 'inactive') {
            return { success: false, message: 'บัญชียังไม่ถูกเปิดใช้งาน' };
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return { success: false, message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' };
        }

        // Generate session token
        const sessionToken = randomString(64);

        // Update user session
        await prisma.user.update({
            where: { id: user.id },
            data: {
                sessionToken,
                sessionDevice: deviceHash || null,
                sessionUpdatedAt: new Date(),
                sessionKickReason: null,
                lastLoginAt: new Date(),
            },
        });

        // Generate JWT tokens
        const tokens = generateTokens({
            id: user.id,
            username: user.username,
            type: 'user',
        });

        logger.info(`User login: ${user.username} (ID: ${user.id})`);

        return {
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ',
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone,
                balance: user.balance.toString(),
            },
            tokens,
        };
    } catch (error) {
        logger.error('Login error:', error);
        return { success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
    }
}

/**
 * User registration
 */
export async function register(input: RegisterInput): Promise<AuthResult> {
    try {
        const {
            username,
            password,
            phone,
            fullName,
            bankCode,
            bankAccount,
            referralCode
        } = input;

        // Check if username exists
        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return { success: false, message: 'ชื่อผู้ใช้นี้มีในระบบแล้ว' };
        }

        // Check if phone exists (if provided)
        if (phone) {
            const existingPhone = await prisma.user.findFirst({
                where: { phone },
            });
            if (existingPhone) {
                return { success: false, message: 'เบอร์โทรศัพท์นี้มีในระบบแล้ว' };
            }
        }

        // Find referrer (if referral code provided)
        let referrerId: number | null = null;
        if (referralCode) {
            const referrer = await prisma.user.findUnique({
                where: { referralCode },
            });
            if (referrer) {
                referrerId = referrer.id;
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Generate referral code for new user
        const newReferralCode = randomString(8).toUpperCase();

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                phone: phone || null,
                fullName: fullName || null,
                bankCode: bankCode || null,
                bankAccount: bankAccount || null,
                referrerId,
                referralCode: newReferralCode,
                status: 'active',
            },
        });

        // Generate session token
        const sessionToken = randomString(64);

        // Update session
        await prisma.user.update({
            where: { id: user.id },
            data: {
                sessionToken,
                sessionUpdatedAt: new Date(),
                lastLoginAt: new Date(),
            },
        });

        // Generate JWT tokens
        const tokens = generateTokens({
            id: user.id,
            username: user.username,
            type: 'user',
        });

        logger.info(`New user registered: ${user.username} (ID: ${user.id})`);

        return {
            success: true,
            message: 'สมัครสมาชิกสำเร็จ',
            user: {
                id: user.id,
                username: user.username,
                phone: user.phone,
                balance: '0.00',
            },
            tokens,
        };
    } catch (error) {
        logger.error('Registration error:', error);
        return { success: false, message: 'เกิดข้อผิดพลาดในการสมัครสมาชิก' };
    }
}

/**
 * Refresh access token
 */
export async function refreshTokens(refreshToken: string): Promise<AuthResult> {
    try {
        const payload = verifyToken(refreshToken, true);

        if (!payload || payload.type !== 'user') {
            return { success: false, message: 'Refresh token ไม่ถูกต้อง' };
        }

        // Verify user still exists and is active
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
        });

        if (!user || user.status !== 'active') {
            return { success: false, message: 'ผู้ใช้ไม่พบหรือถูกระงับ' };
        }

        // Generate new tokens
        const tokens = generateTokens({
            id: user.id,
            username: user.username,
            type: 'user',
        });

        return {
            success: true,
            message: 'Token refreshed',
            tokens,
        };
    } catch (error) {
        logger.error('Refresh token error:', error);
        return { success: false, message: 'ไม่สามารถ refresh token ได้' };
    }
}

/**
 * Logout user
 */
export async function logout(userId: number): Promise<AuthResult> {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: {
                sessionToken: null,
                sessionDevice: null,
            },
        });

        return { success: true, message: 'ออกจากระบบสำเร็จ' };
    } catch (error) {
        logger.error('Logout error:', error);
        return { success: false, message: 'เกิดข้อผิดพลาด' };
    }
}

/**
 * Get current user profile
 */
export async function getCurrentUser(userId: number) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            username: true,
            phone: true,
            email: true,
            fullName: true,
            bankName: true,
            bankCode: true,
            bankAccount: true,
            balance: true,
            totalDeposit: true,
            totalWithdraw: true,
            rankId: true,
            referralCode: true,
            status: true,
            createdAt: true,
            lastLoginAt: true,
        },
    });

    return user;
}

// Export as object for easier importing
export const AuthService = {
    login,
    register,
    refreshTokens,
    logout,
    getCurrentUser,
};

export default AuthService;
