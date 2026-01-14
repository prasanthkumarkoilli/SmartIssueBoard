# 1. Why did you choose the frontend stack you used?
- Simple to set up and fast to develop, and it is widely used in real-world industry projects.
- It has a great component-based structure for pages like Login, Dashboard, Issue List, etc.
- Vite gives very fast development server and builds compared to CRA, and integrates easily with Firebase SDK.
- Easy to route using react-router-dom and manage authentication state.

# 2. Explain your Firestore data structure
  
| Field |	DataType |	Description |
|-------|----------|--------------|
|title	|string	|Issue title
description	|string |	Detailed description
priority |	string	| Low / Medium / High
status |	string	| Open / In Progress / Done
assignedTo |	string	| Name or email
createdBy |	string |	Creator email
createdAt |	timestamp	| Firestore server time

# 3. Explain how you handled similar issues

- I query Firestore for existing issues whose titles start with similar text.
- I compare at least the first few characters of the title.
- If matches exist, I display a warning and a list of similar issues.

# 4. Mention what was confusing or challenging
- Firebase .env configuration with Vite.
- Struggle with adding issues to the Firestore initially.

# 5. Mention what you would improve next
- Role based access control (admin/user permissions).
- Better UI using Tailwind / Material UI.
- File attachments for issues to get a better understanding of the issue.
- Email / push notification on status change.
