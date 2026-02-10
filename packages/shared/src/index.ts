export const SHARED_CONSTANT = 'shared-constant';

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'provider' | 'user';
}
