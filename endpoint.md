1	POST	/api/iam/auth/register	Public	Đăng ký tài khoản mới	fullName, email, password	user, accessToken, refreshToken	
2	POST	/api/iam/auth/login	Public	Đăng nhập	email, password	user, accessToken, refreshToken	
3	POST	/api/iam/auth/refresh-token	Public	Làm mới access token	refreshToken	accessToken, refreshToken	
4	POST	/api/iam/auth/forgot-password	Public	Gửi email reset password	email	message	
5	POST	/api/iam/auth/reset-password	Public	Reset password	token, password	message	
6	POST	/api/iam/auth/logout	Private	Đăng xuất	Authorization Header	message	
7	PUT	/api/iam/auth/change-password	Private	Đổi mật khẩu	currentPassword, newPassword	message	
8	GET	/api/iam/users/me	Private	Lấy profile hiện tại	Authorization Header	user profile	
9	PUT	/api/iam/users/me	Private	Update profile	fullName, avatarUrl	updated user	
10	GET	/api/iam/users/:id	Private	Lấy user theo ID	userId	user	
11	GET	/api/iam/users/workspace/:workspaceId/members	Private	Danh sách member workspace	workspaceId	member list	
12	PATCH	/api/iam/users/:id/role	Private (Admin)	Thay đổi role	role	updated user	
13	PATCH	/api/iam/users/:id/deactivate	Private (Admin)	Vô hiệu hóa tài khoản	userId	message	
14	POST	/api/iam/workspaces	Private	Tạo workspace	name, slug, description	workspace	
15	GET	/api/iam/workspaces/mine	Private	Lấy workspace hiện tại	Authorization Header	workspace	
16	GET	/api/iam/workspaces/:id	Private	Lấy workspace theo ID	workspaceId	workspace	
17	PUT	/api/iam/workspaces/:id	Private	Update workspace	name, description, logoUrl	updated workspace	
18	POST	/api/iam/workspaces/:id/members	Private (Admin)	Thêm member	userId	updated user	
19	DELETE	/api/iam/workspaces/:id/members/:memberId	Private (Admin)	Xóa member	memberId	message	
22	GET	/api/core/projects	Private	Lấy tất cả project	workspace header	project list	
23	POST	/api/core/projects	Private	Tạo project	name, description, visibility	project	
24	GET	/api/core/projects/:id	Private	Chi tiết project	projectId	project detail	
25	PUT	/api/core/projects/:id	Private	Update project	name, description	updated project	
26	DELETE	/api/core/projects/:id	Private	Xóa project	projectId	message	PROJECT_DELETED
27	POST	/api/core/projects/:id/members	Private	Add member	userId	updated project	
28	DELETE	/api/core/projects/:id/members/:memberId	Private	Remove member	memberId	message	
29	POST	/api/core/projects/:id/milestones	Private	Tạo milestone	title, dueDate	milestone	
30	PUT	/api/core/projects/:id/milestones/:mid	Private	Update milestone	title, dueDate	updated milestone	
34	GET	/api/core/tasks	Private	Lấy task theo project	projectId	task list	
35	POST	/api/core/tasks	Private	Tạo task	title, projectId, assigneeId...	task	TASK_CREATED
36	GET	/api/core/tasks/:id	Private	Chi tiết task	taskId	task detail	
37	PUT	/api/core/tasks/:id	Private	Update task	title, priority...	updated task	TASK_UPDATED
38	DELETE	/api/core/tasks/:id	Private	Delete task	taskId	message	TASK_DELETED
39	GET	/api/core/tasks/:id/subtasks	Private	Lấy subtask	parentTaskId	subtask list	
40	PATCH	/api/core/tasks/:id/status	Private	Update status	status	updated task	TASK_STATUS_CHANGED
41	PATCH	/api/core/tasks/:id/assign	Private	Assign task	assigneeId	updated task	TASK_ASSIGNED
42	POST	/api/core/tasks/:id/time-log	Private	Log time	startedAt, endedAt	updated task	
46	GET	/api/core/collaboration/comments	Private	Lấy comments	targetId, targetType	comments	
47	POST	/api/core/collaboration/comments	Private	Tạo comment	content, targetType	comment	COMMENT_CREATED
48	PUT	/api/core/collaboration/comments/:id	Private	Update comment	content	updated comment	
49	DELETE	/api/core/collaboration/comments/:id	Private	Soft delete comment	commentId	message	
50	POST	/api/core/collaboration/comments/:id/reactions	Private	Add reaction	emoji	updated comment	
51	DELETE	/api/core/collaboration/comments/:id/reactions/:emoji	Private	Remove reaction	emoji	updated comment	
52	GET	/api/core/collaboration/activities	Private	Activity log theo target	targetId	activities	
53	GET	/api/core/collaboration/activities/project/:projectId	Private	Activity project	projectId	activities	
54	GET	/api/core/collaboration/activities/workspace	Private	Activity workspace	workspace header	activities	
58	GET	/api/core/attachments	Private	Lấy attachment	targetId, targetType	attachment list	
59	POST	/api/core/attachments	Private	Upload file	file, targetType	attachment	ATTACHMENT_UPLOADED
60	DELETE	/api/core/attachments/:id	Private	Delete file	attachmentId	message	
61	GET	/api/core/attachments/storage	Private	Storage usage	workspace header	usedBytes	
65	GET	/api/core/notifications	Private	Danh sách notification	user header	notifications	
66	GET	/api/core/notifications/unread-count	Private	Số notification chưa đọc	user header	count	
67	PATCH	/api/core/notifications/:id/read	Private	Đánh dấu đã đọc	notificationId	updated notification	
68	PATCH	/api/core/notifications/read-all	Private	Đánh dấu tất cả đã đọc	user header	message	
71	GET	/api/core/analytics/tasks/by-status	Private	Thống kê task theo status	projectId	counts	
72	GET	/api/core/analytics/tasks/by-assignee	Private	Task theo assignee	projectId	counts	
73	GET	/api/core/analytics/tasks/overdue	Private	Task quá hạn	workspace header	overdue list	
74	GET	/api/core/analytics/burndown	Private	Burndown chart	projectId, from, to	chart data	
78	GET	/api/bff/dashboard	Private	Dashboard mobile	headers	dashboard data	
79	GET	/api/bff/projects	Private	Danh sách project	headers	projects	
80	GET	/api/bff/projects/:id	Private	Chi tiết project	projectId	project detail	
81	GET	/api/bff/tasks	Private	Danh sách task	projectId	tasks	
82	GET	/api/bff/tasks/mine	Private	Task của tôi	user header	tasks	
83	GET	/api/bff/tasks/:id	Private	Chi tiết task	taskId	task detail	
84	GET	/api/bff/users/me	Private	Profile đầy đủ	user header	profile	
85	GET	/api/bff/users/members	Private	Member list	workspace header	members	
86	GET	/api/bff/notifications	Private	Notification inbox	user header	notifications	
87	PATCH	/api/bff/notifications/:id/read	Private	Mark read	notificationId	message	
88	PATCH	/api/bff/notifications/read-all	Private	Mark all read	user header	message	