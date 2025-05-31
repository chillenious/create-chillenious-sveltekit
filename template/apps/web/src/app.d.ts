import { User, Session } from 'lib/lucia';

declare global {
	declare namespace App {
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		interface Error {
			message: string;
			returnUrl?: string;
		}
	}
}

declare global {
	interface Window {
		LearnosityApp?: {
			init(request: any, options: any): any;
		};
		pie?;
	}
}
