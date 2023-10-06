import { redirect, type RequestEvent } from '@sveltejs/kit';

export default async function handleOAuth(event: RequestEvent) {
	console.log('handleOAuth');
	const { cookies, url, locals } = event;
	const authMethods = await locals.pb.collection('users').listAuthMethods();

	if (!authMethods) {
		return {
			authProviderRedirect: '',
			authProviderState: ''
		};
	}

	const redirectURL = `${url.origin}/oauth`;
	const googleAuthProvider = authMethods.authProviders[0];
	const authProviderRedirect = googleAuthProvider.authUrl + redirectURL;
	const state = googleAuthProvider.state;
	const verifier = googleAuthProvider.codeVerifier;

	cookies.set('state', state);
	cookies.set('verifier', verifier);

	throw redirect(302, authProviderRedirect);
}
