import type {LayoutServerLoad} from './$types';

export const load: LayoutServerLoad = async (event: any) => {
    let user = event.locals.user;
    if (user) {
        // console.debug('User is authenticated: %O',user);
    }
    return {
        user,
    };
};
