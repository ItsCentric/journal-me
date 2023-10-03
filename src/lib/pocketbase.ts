import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';
import type { Nullable } from 'vitest';

type User = {
	id: string;
	username: string;
	email: string;
	name: string;
	avatar: string;
	created: string;
	updated: string;
};
type UserModel = Nullable<User>;

export const pb = new PocketBase('http://127.0.0.1:8090');

export const currentUser = writable<UserModel>(pb.authStore.model as UserModel);

pb.authStore.onChange((_, model) => {
	currentUser.set(model as UserModel);
});
