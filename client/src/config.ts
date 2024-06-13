import { Pathnames } from 'next-intl/navigation';

export const locales = ['en', 'de'] as const;


// Define your pathnames using the Pathnames type
export const pathnames: Pathnames<typeof locales> = {
	'/': '/',
	'/login': {
		en: '/login',
		de: '/anmelden'
	},
	'/register': {
		en: '/register',
		de: '/registrieren'
	},
	'/frontend': {
		en: '/frontend',
		de: '/fegistrieren'
	}
};

// Define a type for your application pathnames
export type AppPathnames = keyof typeof pathnames;
