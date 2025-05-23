import { useWritable } from '$lib/stores/use-shared-store';

export const pageTitle = () => useWritable<string>('pageTitle', '{{PROJECT_NAME}}');
