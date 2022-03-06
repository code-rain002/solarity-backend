# SOLARITY - API Docs

## Auth Endpoint

| **description** | **path**         | **method** | **data**                         | **result**   |
| --------------- | ---------------- | ---------- | -------------------------------- | ------------ |
| Login           | /api/auth/login  | POST       | in body<br>- email<br>- password | profile data |
| Logout          | /api/auth/logout | POST       |                                  |              |
| Check session   | /api/auth/check  | GET        |                                  |              |
