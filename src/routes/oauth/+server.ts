import { redirect, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, url, cookies }) => {
	const redirectURL = `${url.origin}/oauth`;
	const expectedState = cookies.get('state');
	const expectedVerifier = cookies.get('verifier');
	const state = url.searchParams.get('state');
	const code = url.searchParams.get('code');
	const authMethods = await locals.pb?.collection('users').listAuthMethods();

	if (!authMethods?.authProviders) {
		throw redirect(303, '/signup');
	}
	const provider = authMethods.authProviders[0];
	if (!provider) {
		throw redirect(303, '/signup');
	}

	if (expectedState !== state) {
		throw redirect(303, '/signup');
	}

	if (!code || !expectedVerifier) {
		throw redirect(303, '/signup');
	}

	try {
		await locals.pb
			?.collection('users')
			.authWithOAuth2Code(provider.name, code, expectedVerifier, redirectURL);
	} catch (err) {
		console.log('Error logging in with OAuth2 user', err);
	}

	throw redirect(303, '/');
};
