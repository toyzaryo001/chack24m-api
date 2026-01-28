import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/AuthService';
import { authMiddleware, authLimiter } from '../middleware';
import { validateBody } from '../middleware/validate';
import { successResponse, errors } from '../utils/response';
import { getClientIP } from '../utils/helpers';

const router = Router();

// ============================================
// Validation Schemas
// ============================================

const loginSchema = z.object({
    username: z.string().min(3, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร'),
    password: z.string().min(4, 'รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร'),
});

const registerSchema = z.object({
    username: z.string()
        .min(3, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร')
        .max(50, 'ชื่อผู้ใช้ต้องไม่เกิน 50 ตัวอักษร')
        .regex(/^[a-zA-Z0-9_]+$/, 'ชื่อผู้ใช้ต้องเป็นตัวอักษรภาษาอังกฤษ ตัวเลข หรือ _ เท่านั้น'),
    password: z.string()
        .min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
        .max(100, 'รหัสผ่านยาวเกินไป'),
    confirmPassword: z.string(),
    phone: z.string()
        .regex(/^0[0-9]{9}$/, 'เบอร์โทรศัพท์ไม่ถูกต้อง')
        .optional(),
    fullName: z.string().max(100).optional(),
    bankCode: z.string().max(20).optional(),
    bankAccount: z.string().max(50).optional(),
    referralCode: z.string().max(20).optional(),
}).refine(data => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
});

const refreshSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

// ============================================
// Routes
// ============================================

/**
 * POST /api/auth/login
 * User login
 */
router.post('/login', authLimiter, validateBody(loginSchema), async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const deviceHash = req.headers['x-device-hash'] as string | undefined;

        const result = await AuthService.login({
            username,
            password,
            deviceHash,
        });

        if (!result.success) {
            return errors.unauthorized(res, result.message);
        }

        return successResponse(res, {
            user: result.user,
            tokens: result.tokens,
        }, result.message);
    } catch (error) {
        return errors.internal(res, 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    }
});

/**
 * POST /api/auth/register
 * User registration
 */
router.post('/register', authLimiter, validateBody(registerSchema), async (req: Request, res: Response) => {
    try {
        const { username, password, phone, fullName, bankCode, bankAccount, referralCode } = req.body;

        const result = await AuthService.register({
            username,
            password,
            phone,
            fullName,
            bankCode,
            bankAccount,
            referralCode,
        });

        if (!result.success) {
            return errors.badRequest(res, result.message);
        }

        return successResponse(res, {
            user: result.user,
            tokens: result.tokens,
        }, result.message, 201);
    } catch (error) {
        return errors.internal(res, 'เกิดข้อผิดพลาดในการสมัครสมาชิก');
    }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', validateBody(refreshSchema), async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        const result = await AuthService.refreshTokens(refreshToken);

        if (!result.success) {
            return errors.unauthorized(res, result.message);
        }

        return successResponse(res, {
            tokens: result.tokens,
        }, result.message);
    } catch (error) {
        return errors.internal(res, 'เกิดข้อผิดพลาด');
    }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const result = await AuthService.logout(userId);

        return successResponse(res, null, result.message);
    } catch (error) {
        return errors.internal(res, 'เกิดข้อผิดพลาด');
    }
});

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const user = await AuthService.getCurrentUser(userId);

        if (!user) {
            return errors.notFound(res, 'ไม่พบผู้ใช้');
        }

        return successResponse(res, user, 'Success');
    } catch (error) {
        return errors.internal(res, 'เกิดข้อผิดพลาด');
    }
});

export default router;
