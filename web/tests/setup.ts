// Minimal setup for utility tests only
// Mock fetch for API testing
// @ts-ignore
global.fetch = async () => new Response();