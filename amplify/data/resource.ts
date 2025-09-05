import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
const schema = a.schema({
	Todo: a
		.model({
			content: a.string(),
		})
		.authorization((allow) => [
			allow.owner('oidc').to(['read', 'update', 'delete']).identityClaim('sub'),
		]),
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: 'oidc',
		oidcAuthorizationMode: {
			oidcProviderName: 'clerk', //can be any name. Not sure why this is needed since appsync doesn't require it
			clientId: 'appsync', //must be in the `aud` array in the JWT
			oidcIssuerUrl: 'https://sweeping-wildcat-6.clerk.accounts.dev', //must be the same as the `iss` in the JWT
			tokenExpiryFromAuthInSeconds: 60 * 60 * 24, //24 hours. Not sure why this is needed since appsync doesn't require it
			tokenExpireFromIssueInSeconds: 300, // 5 minutes. Uses the `iat` claim in the JWT
		},
	},
})
