export const createClient = jest.fn(() => ({
    from: jest.fn(() => ({
        select: jest.fn().mockResolvedValue({ data: [], error: null }),
        insert: jest.fn().mockResolvedValue({ data: [], error: null }),
        delete: jest.fn().mockResolvedValue({ data: [], error: null }),
    })),
    auth: {
        getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
    },
}));
