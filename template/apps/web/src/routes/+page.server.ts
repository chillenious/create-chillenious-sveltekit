import type {PageServerLoad} from './$types';

export const load: PageServerLoad = async ({locals}) => {
    const {user} = locals;
    // Early return if no user (keeps functionality for unauthenticated users)
    if (!user) {
        return {
            user: null,
        };
    }
    // Clone the user to avoid modifying the original
    const userData = {...user};
    // add other stuff
    return {
        user: userData,
    };
};
