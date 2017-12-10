
// /**
//  *
//  * NOTE:
//  *
//  * This is a legacy model, it is only used for compatibility with
//  * API v2. On API v3 we store tokens in AuthTokens however API v2
//  * does it in this table (UserTokens). Also API v2 doesn't have
//  * refresh token, it only has access tokens which means we need
//  * to store a long lived access token into this table just so that
//  * API v2 can continue using other endpoints with this token.
//  *
//  */

export class UserTokens {

	public UserId: string;

	public TokenId: string;

	public Expiry: Date;
}