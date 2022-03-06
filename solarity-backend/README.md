# SOLARITY - API Docs

<br/>

## Auth Endpoint

| **description** | **path**         | **method** | **data**                        | **result**   |
| --------------- | ---------------- | ---------- | ------------------------------- | ------------ |
| Login           | /api/auth/login  | POST       | BODY<br>- email*<br>- password* | profile data |
| Logout          | /api/auth/logout | POST       |                                 |              |
| Check session   | /api/auth/check  | GET        |                                 |              |

<br/>
## Profile Endpoint

| **description**                | **path**                   | **method** | **data**                                     | **result**   |
| ------------------------------ | -------------------------- | ---------- | -------------------------------------------- | ------------ |
| Fetch Profile                  | /api/profile               | GET        |                                              | profile data |
| Update Profile _(in progress)_ | /api/profile               | POST       | BODY<br>- name\*                             | profile data |
| Update Password                | /api/profile/password      | POST       | BODY<br>- currentPassword*<br>- newPassword* |              |
| Update Public Address          | /api/profile/publicAddress | POST       | BODY<br>- publicAddress\*                    |              |
