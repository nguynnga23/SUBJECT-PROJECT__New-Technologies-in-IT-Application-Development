---
title: Class Diagram
---

```mermaid
classDiagram
    class Account {
        +String id
        +String name
        +String number
        +String password
        +String? avatar
        +String? status
        +DateTime? birthDate
        +String? location
        +String gender
        +String[] currentAvatars
        +DateTime createdAt
        +DateTime updatedAt
    }

    class FriendRequest {
        +String id
        +String senderId
        +String receiverId
        +Boolean block
        +DateTime createdAt
    }

    class Friend {
        +String id
        +String user1Id
        +String user2Id
        +DateTime createdAt
    }

    class Chat {
        +String id
        +Boolean isGroup
        +String? name
        +String? avatar
        +DateTime createdAt
        +DateTime updatedAt
    }

    class ChatParticipant {
        +String id
        +String chatId
        +String accountId
        +Boolean pin
        +Boolean notify
        +ChatRole role
    }

    class Message {
        +String id
        +String chatId
        +String senderId
        +String? content
        +String type
        +DateTime time
        +String[] deletedBy
        +Boolean destroy
    }

    class Reaction {
        +String id
        +String messageId
        +String userId
        +String reaction
        +Int sum
    }

    class ChatRole {
        <<enumeration>>
        MEMBER
        LEADER
    }

    %% Quan hệ giữa các thực thể
    Account "1" --o "many" FriendRequest : sentRequests
    Account "1" --o "many" FriendRequest : receivedRequests
    Account "1" --o "many" Friend : friends1
    Account "1" --o "many" Friend : friends2
    Account "1" --o "many" ChatParticipant : participatesIn
    Account "1" --o "many" Message : sentMessages
    Account "1" --o "many" Reaction : reactionsGiven

    FriendRequest "many" --o "1" Account : sender
    FriendRequest "many" --o "1" Account : receiver

    Friend "many" --o "1" Account : user1
    Friend "many" --o "1" Account : user2

    Chat "1" --o "many" ChatParticipant : participants
    Chat "1" --o "many" Message : messages

    ChatParticipant "many" --o "1" Chat : chat
    ChatParticipant "many" --o "1" Account : participant

    Message "many" --o "1" Chat : chat
    Message "many" --o "1" Account : sender
    Message "1" --o "many" Reaction : reactions

    Reaction "many" --o "1" Message : message
    Reaction "many" --o "1" Account : reactedBy

    ChatParticipant --> ChatRole

```

- **Account** có thể gửi/nhận **FriendRequest**
- **Friend** biểu diễn mối quan hệ bạn bè giữa hai **Account**
- **Chat** có nhiều **ChatParticipant** và **Message**
- **Message** có thể nhận nhiều **Reaction** từ _Account_
- **ChatParticipant** có vai trò (**ChatRole**)
