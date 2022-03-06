# SOLARITY - API Docs

<br/>

## Auth Endpoint

| **description** | **path**         | **method** | **data**                                          | **result**   |
| --------------- | ---------------- | ---------- | ------------------------------------------------- | ------------ |
| Login           | /api/auth/login  | POST       | BODY<br>- email[string]\*<br>- password[string]\* | profile data |
| Logout          | /api/auth/logout | POST       |                                                   |              |
| Check session   | /api/auth/check  | GET        |                                                   |              |

<br/>

## Profile Endpoint

| **description**                | **path**                   | **method** | **data**                                                       | **result**   |
| ------------------------------ | -------------------------- | ---------- | -------------------------------------------------------------- | ------------ |
| Fetch Profile                  | /api/profile               | GET        |                                                                | profile data |
| Update Profile _(in progress)_ | /api/profile               | POST       | BODY<br>- name[string]\*                                       | profile data |
| Update Password                | /api/profile/password      | POST       | BODY<br>- currentPassword[string]\*<br>- newPassword[string]\* |              |
| Update Public Address          | /api/profile/publicAddress | POST       | BODY<br>- publicAddress[string]\*                              |              |

<br/>

## NFT Endpoint

| **description**                  | **path**                     | **method** | **data**                     | **result**                                                                   |
| -------------------------------- | ---------------------------- | ---------- | ---------------------------- | ---------------------------------------------------------------------------- |
| Fetch Collections                | /api/nft/collections         | GET        | QUERY<br>- following[bool]   | all nft collections<br>with following=1, collections that are being followed |
| Fetch Single Collection          | /api/nft/collections/:symbol | GET        | QUERY<br>- excludeNFTs[bool] | all nft details                                                              |
| Add Collection to Watchlist      | /api/nft/collections         | POST       | BODY<br>- symbol[string]\*   | all nft details                                                              |
| Remove Collection from Watchlist | /api/nft/collections/:symbol | DELETE     |                              |                                                                              |
