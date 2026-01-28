// App Constants
export const CONSTANTS = {
    // Session
    SESSION_TIMEOUT_MEMBER: 3 * 60 * 60, // 3 hours in seconds
    SESSION_TIMEOUT_ADMIN: 12 * 60 * 60, // 12 hours in seconds

    // Pagination
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,

    // Rate Limits
    AUTH_RATE_LIMIT: 5, // 5 attempts
    AUTH_RATE_WINDOW: 15 * 60 * 1000, // 15 minutes

    // Balance
    MIN_DEPOSIT: 20,
    MAX_DEPOSIT: 100000,
    MIN_WITHDRAW: 100,
    MAX_WITHDRAW: 50000,

    // Transaction Status
    TX_STATUS: {
        PENDING: 'pending',
        PROCESSING: 'processing',
        COMPLETED: 'completed',
        REJECTED: 'rejected',
        CANCELLED: 'cancelled',
        FAILED: 'failed',
    } as const,

    // Transaction Types
    TX_TYPE: {
        DEPOSIT: 'deposit',
        WITHDRAW: 'withdraw',
        BONUS: 'bonus',
        CASHBACK: 'cashback',
        ADJUSTMENT: 'adjustment',
        AFFILIATE: 'affiliate',
    } as const,

    // User Status
    USER_STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        BANNED: 'banned',
    } as const,

    // Deposit Channels
    DEPOSIT_CHANNELS: {
        BANK: 'bank',
        TRUEWALLET: 'truewallet',
        PROMPTPAY: 'promptpay',
        QR: 'qr',
        SLIP: 'slip',
        AUTO: 'auto',
    } as const,

    // Bank Codes (Canonical)
    BANK_CODES: {
        KBANK: 'KBANK',
        BBL: 'BBL',
        SCB: 'SCB',
        KTB: 'KTB',
        TTB: 'TTB',
        GSB: 'GSB',
        KKP: 'KKP',
        BAY: 'BAY',
        BAAC: 'BAAC',
        TRUEWALLET: 'TRUEWALLET',
    } as const,
} as const;

// Type exports
export type TxStatus = typeof CONSTANTS.TX_STATUS[keyof typeof CONSTANTS.TX_STATUS];
export type TxType = typeof CONSTANTS.TX_TYPE[keyof typeof CONSTANTS.TX_TYPE];
export type UserStatus = typeof CONSTANTS.USER_STATUS[keyof typeof CONSTANTS.USER_STATUS];
export type DepositChannel = typeof CONSTANTS.DEPOSIT_CHANNELS[keyof typeof CONSTANTS.DEPOSIT_CHANNELS];
export type BankCode = typeof CONSTANTS.BANK_CODES[keyof typeof CONSTANTS.BANK_CODES];
