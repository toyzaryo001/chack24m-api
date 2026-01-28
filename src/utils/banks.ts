import { CONSTANTS, BankCode } from '../config/constants';

// Bank code normalization (ported from PHP tw_bank_code function)
const BANK_ALIASES: Record<string, BankCode> = {
    // KBANK
    'kbank': CONSTANTS.BANK_CODES.KBANK,
    'kasikorn': CONSTANTS.BANK_CODES.KBANK,
    'kasikornbank': CONSTANTS.BANK_CODES.KBANK,
    'กสิกรไทย': CONSTANTS.BANK_CODES.KBANK,
    'กสิกร': CONSTANTS.BANK_CODES.KBANK,

    // BBL
    'bbl': CONSTANTS.BANK_CODES.BBL,
    'bangkok': CONSTANTS.BANK_CODES.BBL,
    'bangkokbank': CONSTANTS.BANK_CODES.BBL,
    'กรุงเทพ': CONSTANTS.BANK_CODES.BBL,

    // SCB
    'scb': CONSTANTS.BANK_CODES.SCB,
    'scbb': CONSTANTS.BANK_CODES.SCB,
    'siam': CONSTANTS.BANK_CODES.SCB,
    'siamcommercial': CONSTANTS.BANK_CODES.SCB,
    'ไทยพาณิชย์': CONSTANTS.BANK_CODES.SCB,

    // KTB
    'ktb': CONSTANTS.BANK_CODES.KTB,
    'krungthai': CONSTANTS.BANK_CODES.KTB,
    'กรุงไทย': CONSTANTS.BANK_CODES.KTB,

    // TTB
    'ttb': CONSTANTS.BANK_CODES.TTB,
    'tmb': CONSTANTS.BANK_CODES.TTB,
    'tmbpayment': CONSTANTS.BANK_CODES.TTB,
    'tmbthanachart': CONSTANTS.BANK_CODES.TTB,
    'ทหารไทยธนชาต': CONSTANTS.BANK_CODES.TTB,

    // GSB
    'gsb': CONSTANTS.BANK_CODES.GSB,
    'governmentsavings': CONSTANTS.BANK_CODES.GSB,
    'ออมสิน': CONSTANTS.BANK_CODES.GSB,

    // KKP
    'kkp': CONSTANTS.BANK_CODES.KKP,
    'kiatnakin': CONSTANTS.BANK_CODES.KKP,
    'kiatnakinphatra': CONSTANTS.BANK_CODES.KKP,
    'เกียรตินาคินภัทร': CONSTANTS.BANK_CODES.KKP,

    // BAY
    'bay': CONSTANTS.BANK_CODES.BAY,
    'krungsri': CONSTANTS.BANK_CODES.BAY,
    'ayudhya': CONSTANTS.BANK_CODES.BAY,
    'กรุงศรีอยุธยา': CONSTANTS.BANK_CODES.BAY,
    'กรุงศรี': CONSTANTS.BANK_CODES.BAY,

    // BAAC
    'baac': CONSTANTS.BANK_CODES.BAAC,
    'agriculturalbank': CONSTANTS.BANK_CODES.BAAC,
    'ธกส': CONSTANTS.BANK_CODES.BAAC,
    'เพื่อการเกษตร': CONSTANTS.BANK_CODES.BAAC,

    // TrueWallet
    'truewallet': CONSTANTS.BANK_CODES.TRUEWALLET,
    'truemoney': CONSTANTS.BANK_CODES.TRUEWALLET,
    'tmn': CONSTANTS.BANK_CODES.TRUEWALLET,
    'ทรูวอลเล็ท': CONSTANTS.BANK_CODES.TRUEWALLET,
};

/**
 * Normalize bank code to canonical format
 * @param value Raw bank code/name
 * @returns Canonical bank code or null
 */
export function normalizeBankCode(value: string | null | undefined): BankCode | null {
    if (!value) return null;

    const normalized = value.toLowerCase().trim().replace(/[\s\-_]/g, '');

    // Check if already a canonical code
    if (Object.values(CONSTANTS.BANK_CODES).includes(normalized.toUpperCase() as BankCode)) {
        return normalized.toUpperCase() as BankCode;
    }

    // Check aliases
    return BANK_ALIASES[normalized] || null;
}

/**
 * Get bank display name
 */
export function getBankName(code: BankCode): string {
    const names: Record<BankCode, string> = {
        KBANK: 'ธนาคารกสิกรไทย',
        BBL: 'ธนาคารกรุงเทพ',
        SCB: 'ธนาคารไทยพาณิชย์',
        KTB: 'ธนาคารกรุงไทย',
        TTB: 'ธนาคารทหารไทยธนชาต',
        GSB: 'ธนาคารออมสิน',
        KKP: 'ธนาคารเกียรตินาคินภัทร',
        BAY: 'ธนาคารกรุงศรีอยุธยา',
        BAAC: 'ธนาคารเพื่อการเกษตร (ธกส.)',
        TRUEWALLET: 'TrueMoney Wallet',
    };
    return names[code] || code;
}
