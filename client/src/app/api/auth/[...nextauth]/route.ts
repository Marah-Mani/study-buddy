import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import LinkedInProvider from 'next-auth/providers/linkedin';

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.NEXT_PUBLIC_GOOGLE_ID as string,
			clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET as string
		}),
		FacebookProvider({
			clientId: process.env.NEXT_PUBLIC_FACEBOOK_ID as string,
			clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_SECRET as string
		})
	]
});

export { handler as GET, handler as POST };
