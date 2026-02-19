export const API_CONFIG = {
    LONG_URL: 'https://control-hogar-psi.vercel.app/api/',
    SHORT_URL: '/api/',
    SHORT_URL_PC: '/api/api/',
};

export const CONTENT_TYPES = {
    JSON: { 'Content-Type': 'application/json' },
    X_WWW_FORM_URLENCODED: { 'Content-Type': 'application/x-www-form-urlencoded' },
};

export const ROKU_CONFIG = {
    IP: 'http://192.168.86.28:8060/',
    IP_PC: '/roku',
    TIMEOUT: 2000,
    POST_TIMEOUT: 1000,
};

export const ENDPOINTS = {
    UPDATE_TABLE: 'updateTableInSupabase',
    UPSERT_TABLE: 'upsertTableInSupabase',
    UPDATE_SELECTIONS: 'updateSelectionsInSupabase',
    GET_TABLE: 'getTableFromSupabase',
    GET_YOUTUBE_VIDEOS: 'getVideosFromYoutube',
    SEND_LOGS: 'sendLogs',
    VALIDATE_CREDENTIALS: 'validateCredentials',
    SEND_IFTTT: 'sendIfttt',
};
