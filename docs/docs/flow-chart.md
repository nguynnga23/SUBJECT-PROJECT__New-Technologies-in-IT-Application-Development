---
title: Flow Diagram
---

## Nhóm 1: Quản lý tài khoản (UC001 - UC004)

```plantuml
@startuml
skinparam monochrome true

|User|
:Nhập thông tin (email, số điện thoại, mật khẩu);
-> |Server|

|Server|
:UC001 - Đăng ký tài khoản;
:Kiểm tra email/số điện thoại;
if (Đã tồn tại?) then (Có)
  :Trả về lỗi "Tài khoản đã tồn tại";
  -> |User|
else (Không)
  :Gửi OTP;
  -> |User|
  :Nhập OTP;
  -> |Server|
  :Xác thực OTP;
  if (OTP đúng?) then (Có)
    :Lưu tài khoản;
    :Trả về "Đăng ký thành công";
    -> |User|
  else (Không)
    :Trả về lỗi "OTP không đúng";
    -> |User|
  endif
endif

|User|
:Nhập thông tin đăng nhập;
-> |Server|

|Server|
:UC002 - Đăng nhập hệ thống;
:Kiểm tra thông tin;
if (Thông tin đúng?) then (Có)
  :Tạo JWT + OAuth2;
  :Trả về token;
  -> |User|
else (Không)
  :Trả về lỗi "Thông tin không đúng";
  -> |User|
endif

|User|
:Nhấn đăng xuất;
-> |Server|

|Server|
:UC003 - Đăng xuất khỏi hệ thống;
:Xác thực token;
:Xóa token (nếu cần);
:Trả về "Đăng xuất thành công";
-> |User|

|User|
:Nhập thông tin mới (avatar, bio, ...);
-> |Server|

|Server|
:UC004 - Cập nhật thông tin cá nhân;
:Xác thực token;
:Cập nhật thông tin;
:Trả về "Cập nhật thành công";
-> |User|

@enduml
```

## Nhóm 2: Quản lý kết bạn (UC005 - UC011)

```plantuml
@startuml
skinparam monochrome true

|User|
:Nhập từ khóa tìm kiếm;
-> |Server|

|Server|
:UC005 - Tìm kiếm người dùng;
:Tìm theo phone/email/username;
:Trả về danh sách người dùng;
-> |User|

|User|
:Gửi lời mời kết bạn;
-> |Server|

|Server|
:UC006 - Gửi lời mời kết bạn;
:Lưu yêu cầu;
:Trả về "Đã gửi lời mời";
-> |User|

|User|
:Chọn "Chấp nhận" lời mời;
-> |Server|

|Server|
:UC007 - Chấp nhận lời mời kết bạn;
:Cập nhật trạng thái bạn bè;
:Trả về "Đã chấp nhận";
-> |User|

|User|
:Chọn "Từ chối" lời mời;
-> |Server|

|Server|
:UC008 - Từ chối lời mời kết bạn;
:Xóa yêu cầu;
:Trả về "Đã từ chối";
-> |User|

|User|
:Xem danh sách bạn bè;
-> |Server|

|Server|
:UC009 - Xem danh sách bạn bè;
:Lấy danh sách;
:Trả về danh sách bạn bè;
-> |User|

|User|
:Xóa bạn bè;
-> |Server|

|Server|
:UC010 - Xóa bạn bè;
:Xác nhận xóa;
:Xóa quan hệ bạn bè;
:Trả về "Đã xóa";
-> |User|

|User|
:Chặn người dùng;
-> |Server|

|Server|
:UC011 - Chặn người dùng;
:Thêm vào danh sách chặn;
:Trả về "Đã chặn";
-> |User|

@enduml
```

## Nhóm 3: Tin nhắn cá nhân và nhóm (UC012 - UC020)

```plantuml
@startuml
skinparam monochrome true

|User|
:Gửi tin nhắn 1-1;
-> |Server|

|Server|
:UC012 - Gửi tin nhắn 1-1;
:Lưu tin nhắn;
:Trả về "Đã gửi";
-> |User|

|User|
:Tạo nhóm chat;
-> |Server|

|Server|
:UC013 - Tạo nhóm chat;
:Lưu nhóm & thành viên;
:Trả về "Nhóm đã tạo";
-> |User|

|User|
:Thêm thành viên vào nhóm;
-> |Server|

|Server|
:UC014 - Thêm thành viên vào nhóm;
:Cập nhật danh sách thành viên;
:Trả về "Đã thêm";
-> |User|

|User|
:Gửi phản ứng tin nhắn;
-> |Server|

|Server|
:UC015 - Gửi phản ứng tin nhắn;
:Lưu reaction;
:Trả về "Đã thêm reaction";
-> |User|

|User|
:Ghim tin nhắn;
-> |Server|

|Server|
:UC016 - Ghim tin nhắn;
:Đánh dấu ghim;
:Trả về "Đã ghim";
-> |User|

|User|
:Gửi tin nhắn nhóm;
-> |Server|

|Server|
:UC017 - Gửi tin nhắn nhóm;
:Lưu tin nhắn;
:Trả về "Đã gửi";
-> |User|

|User|
:Tắt thông báo nhóm;
-> |Server|

|Server|
:UC018 - Tắt thông báo nhóm chat;
:Cập nhật trạng thái;
:Trả về "Đã tắt";
-> |User|

|User|
:Đổi vai trò trong nhóm;
-> |Server|

|Server|
:UC019 - Đổi vai trò trong nhóm;
:Cập nhật vai trò;
:Trả về "Đã đổi";
-> |User|

|User|
:Rời nhóm chat;
-> |Server|

|Server|
:UC020 - Rời nhóm chat;
:Xóa thành viên;
:Trả về "Đã rời";
-> |User|

@enduml
```

## Nhóm 4: Tính năng tin nhắn nâng cao (UC021 - UC024)

```plantuml
@startuml
skinparam monochrome true

actor User
participant "Client" as Client
participant "Server" as Server
participant "Database" as DB
participant "Notification" as Notif

== UC021: Gửi hình ảnh, video, file đính kèm ==
User -> Client: Chọn file & gửi
Client -> Server: POST /messages/files {file}
Server -> DB: Lưu file & liên kết với tin nhắn
DB --> Server: Xác nhận
Server --> Client: 200 {fileUrl}
Client --> User: Hiển thị file trong cuộc trò chuyện

== UC022: Gửi emoji, reactions ==
User -> Client: Chọn emoji & thả vào tin nhắn
Client -> Server: POST /messages/{messageId}/emoji {emoji}
Server -> DB: Lưu emoji
DB --> Server: Xác nhận
Server --> Client: 200 "Đã thêm emoji"
Client --> User: Hiển thị emoji

== UC023: Nhận thông báo tin nhắn mới ==
Server -> DB: Lưu tin nhắn mới
DB --> Server: Xác nhận
Server -> Notif: Gửi thông báo đẩy
Notif --> Client: Tin nhắn mới {content}
Client --> User: Hiển thị thông báo

== UC024: Xóa tin nhắn hoặc cuộc trò chuyện ==
User -> Client: Chọn tin nhắn/cuộc trò chuyện & nhấn "Xóa"
Client -> Server: DELETE /messages/{messageId} hoặc /conversations/{conversationId}
Server -> DB: Xóa tin nhắn/cuộc trò chuyện
DB --> Server: Xác nhận
Server --> Client: 200 "Đã xóa"
Client --> User: Cập nhật giao diện

@enduml
```
