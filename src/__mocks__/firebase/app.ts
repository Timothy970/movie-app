export const initializeApp = jest.fn();
export const getApps = jest.fn(() => []);

// Allow any value
export type FirebaseApp = unknown;
