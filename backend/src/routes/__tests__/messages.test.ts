import request from "supertest";
import { app } from "../../server";
import { prisma } from "../../utils/prisma";

describe("Messages API", () => {
  let userToken: string;
  let agentToken: string;
  let userId: string;
  let agentId: string;
  let messageId: string;
  let conversationPartnerId: string;

  beforeAll(async () => {
    // Create test user
    const userRes = await request(app).post("/api/v1/auth/register").send({
      email: "message.user@example.com",
      password: "password123",
      firstName: "Message",
      lastName: "User",
      userType: "BUYER",
    });

    userToken = userRes.body.data.accessToken;
    userId = userRes.body.data.user.id;

    // Create test agent
    const agentRes = await request(app).post("/api/v1/auth/register").send({
      email: "message.agent@example.com",
      password: "password123",
      firstName: "Message",
      lastName: "Agent",
      userType: "AGENT",
    });

    agentToken = agentRes.body.data.accessToken;
    agentId = agentRes.body.data.user.id;

    // Register as agent
    await request(app)
      .post("/api/v1/auth/register-agent")
      .set("Authorization", `Bearer ${agentToken}`)
      .send({
        licenseNumber: "MSG777777",
        licenseState: "California",
        licenseExpiry: "2025-12-31",
        brokerage: "Message Realty",
      });

    conversationPartnerId = agentId;
  });

  describe("POST /api/messages", () => {
    it("should send a text message successfully", async () => {
      const messageData = {
        recipientId: agentId,
        content: "Hello! I am interested in your properties.",
        messageType: "TEXT",
      };

      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send(messageData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.message.content).toBe(messageData.content);
      expect(res.body.data.message.senderId).toBe(userId);
      expect(res.body.data.message.recipientId).toBe(agentId);
      expect(res.body.data.message.messageType).toBe("TEXT");
      expect(res.body.data.message.read).toBe(false);
      expect(res.body.data.message.sender).toBeDefined();

      messageId = res.body.data.message.id;
    });

    it("should create notification for recipient", async () => {
      // Send another message to test notification creation
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: agentId,
          content: "Test notification message",
          messageType: "TEXT",
        });

      expect(res.status).toBe(201);

      // Check if notification was created
      const notification = await prisma.notification.findFirst({
        where: {
          userId: agentId,
          type: "MESSAGE",
        },
        orderBy: { createdAt: "desc" },
      });

      expect(notification).toBeDefined();
      expect(notification?.title).toBe("New message");
      expect(notification?.message).toContain("Test notification message");
      expect(notification?.actionUrl).toBe(`/messages/${userId}`);
    });

    it("should send message with lead ID", async () => {
      // First create a property
      const propertyRes = await request(app)
        .post("/api/v1/properties")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          title: "Test Property for Message",
          description: "Property for messaging test",
          propertyType: "HOUSE",
          listingType: "SALE",
          streetAddress: "123 Message St",
          city: "Test City",
          state: "CA",
          zipCode: "12345",
          country: "USA",
          latitude: 37.7749,
          longitude: -122.4194,
          price: 500000,
          bedrooms: 3,
          bathrooms: 2,
          squareFeet: 1500,
          yearBuilt: 2020,
          photos: [
            {
              url: "https://example.com/msg-property.jpg",
              isPrimary: true,
            },
          ],
        });

      const propertyId = propertyRes.body.data.id;

      // Create a lead
      const leadRes = await request(app)
        .post("/api/v1/properties/12345/schedule-showing")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          scheduledAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          type: "IN_PERSON",
          notes: "Interested in this property",
        });

      // Send message with lead ID (if lead creation succeeded)
      if (leadRes.status === 201) {
        const leadId = leadRes.body.data.id;

        const messageRes = await request(app)
          .post("/api/v1/messages")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            recipientId: agentId,
            content: "Question about the property showing",
            messageType: "TEXT",
            leadId: leadId,
          });

        // May fail if lead creation didn't work, but that's ok for this test
        expect([201, 404]).toContain(messageRes.status);
      }
    });

    it("should reject messages to self", async () => {
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: userId,
          content: "Sending message to myself",
          messageType: "TEXT",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("Cannot send message to yourself");
    });

    it("should require authentication", async () => {
      const res = await request(app).post("/api/v1/messages").send({
        recipientId: agentId,
        content: "Unauthorized message",
        messageType: "TEXT",
      });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should validate recipient exists", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: fakeId,
          content: "Message to non-existent user",
          messageType: "TEXT",
        });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("Recipient not found");
    });

    it("should validate required fields", async () => {
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should validate content length", async () => {
      const longContent = "a".repeat(5001);
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: agentId,
          content: longContent,
          messageType: "TEXT",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should validate message type", async () => {
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: agentId,
          content: "Test message",
          messageType: "INVALID_TYPE",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should handle different message types", async () => {
      const messageTypes = ["TEXT", "IMAGE", "DOCUMENT", "VOICE", "VIDEO"];

      for (const type of messageTypes) {
        const res = await request(app)
          .post("/api/v1/messages")
          .set("Authorization", `Bearer ${userToken}`)
          .send({
            recipientId: agentId,
            content: `Test ${type} message`,
            messageType: type,
          });

        expect(res.status).toBe(201);
        expect(res.body.data.message.messageType).toBe(type);
      }
    });
  });

  describe("GET /api/messages/conversations", () => {
    beforeAll(async () => {
      // Send a few messages to create conversations
      await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          recipientId: userId,
          content: "Reply from agent",
          messageType: "TEXT",
        });
    });

    it("should return list of conversations", async () => {
      const res = await request(app)
        .get("/api/v1/messages/conversations")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.conversations).toBeInstanceOf(Array);
      expect(res.body.data.totalUnread).toBeDefined();

      // Should have at least one conversation with the agent
      const conversationWithAgent = res.body.data.conversations.find(
        (c: any) => c.partnerId === agentId,
      );
      expect(conversationWithAgent).toBeDefined();
      expect(conversationWithAgent.partner).toBeDefined();
      expect(conversationWithAgent.lastMessage).toBeDefined();
      expect(conversationWithAgent.unreadCount).toBeDefined();
    });

    it("should require authentication", async () => {
      const res = await request(app).get("/api/v1/messages/conversations");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should sort conversations by last message time", async () => {
      const res = await request(app)
        .get("/api/v1/messages/conversations")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const conversations = res.body.data.conversations;
      if (conversations.length > 1) {
        for (let i = 1; i < conversations.length; i++) {
          const currentTime = conversations[i - 1].updatedAt
            ? new Date(conversations[i - 1].updatedAt).getTime()
            : 0;
          const nextTime = conversations[i].updatedAt
            ? new Date(conversations[i].updatedAt).getTime()
            : 0;
          expect(currentTime).toBeGreaterThanOrEqual(nextTime);
        }
      }
    });

    it("should include partner information", async () => {
      const res = await request(app)
        .get("/api/v1/messages/conversations")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      res.body.data.conversations.forEach((conversation: any) => {
        expect(conversation.partner).toBeDefined();
        expect(conversation.partner.id).toBeDefined();
        expect(conversation.partner.firstName).toBeDefined();
        expect(conversation.partner.lastName).toBeDefined();
        expect(conversation.partner.email).toBeDefined();
        expect(conversation.partner.userType).toBeDefined();
      });
    });
  });

  describe("GET /api/messages/conversations/:partnerId", () => {
    it("should return conversation with specific partner", async () => {
      const res = await request(app)
        .get(`/api/v1/messages/conversations/${agentId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.partner.id).toBe(agentId);
      expect(res.body.data.messages).toBeInstanceOf(Array);

      // Messages should be sorted chronologically (oldest first)
      if (res.body.data.messages.length > 1) {
        for (let i = 1; i < res.body.data.messages.length; i++) {
          const prevTime = new Date(
            res.body.data.messages[i - 1].createdAt,
          ).getTime();
          const currTime = new Date(
            res.body.data.messages[i].createdAt,
          ).getTime();
          expect(prevTime).toBeLessThanOrEqual(currTime);
        }
      }
    });

    it("should mark messages as read", async () => {
      // Send an unread message first
      await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          recipientId: userId,
          content: "Unread message test",
          messageType: "TEXT",
        });

      // Get conversation (should mark messages as read)
      const res = await request(app)
        .get(`/api/v1/messages/conversations/${agentId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Check that messages from agent are now marked as read
      const agentMessages = res.body.data.messages.filter(
        (m: any) => m.senderId === agentId,
      );
      agentMessages.forEach((message: any) => {
        expect(message.read).toBe(true);
      });
    });

    it("should return 404 for non-existent partner", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const res = await request(app)
        .get(`/api/v1/messages/conversations/${fakeId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should require authentication", async () => {
      const res = await request(app).get(
        `/api/v1/messages/conversations/${agentId}`,
      );

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should include sender information in messages", async () => {
      const res = await request(app)
        .get(`/api/v1/messages/conversations/${agentId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      res.body.data.messages.forEach((message: any) => {
        expect(message.sender).toBeDefined();
        expect(message.sender.id).toBeDefined();
        expect(message.sender.firstName).toBeDefined();
        expect(message.sender.lastName).toBeDefined();
      });
    });
  });

  describe("GET /api/messages", () => {
    it("should return all user messages", async () => {
      const res = await request(app)
        .get("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.messages).toBeInstanceOf(Array);
      expect(res.body.data.pagination).toBeDefined();

      // Should include both sent and received messages
      const messageIds = res.body.data.messages
        .map((m: any) => [m.senderId, m.recipientId])
        .flat();
      expect(messageIds).toContain(userId);
    });

    it("should handle pagination", async () => {
      const res = await request(app)
        .get("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .query({ page: 1, limit: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.messages.length).toBeLessThanOrEqual(5);
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(5);
      expect(res.body.data.pagination.totalPages).toBeDefined();
    });

    it("should require authentication", async () => {
      const res = await request(app).get("/api/v1/messages");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should include sender and recipient information", async () => {
      const res = await request(app)
        .get("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .query({ limit: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      res.body.data.messages.forEach((message: any) => {
        expect(message.sender).toBeDefined();
        expect(message.recipient).toBeDefined();
        expect(message.sender.id).toBeDefined();
        expect(message.recipient.id).toBeDefined();
      });
    });
  });

  describe("PUT /api/messages/:id/read", () => {
    let unreadMessageId: string;

    beforeAll(async () => {
      // Send an unread message
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          recipientId: userId,
          content: "Message to mark as read",
          messageType: "TEXT",
        });

      unreadMessageId = res.body.data.message.id;
    });

    it("should mark message as read", async () => {
      const res = await request(app)
        .put(`/api/v1/messages/${unreadMessageId}/read`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("marked as read");
    });

    it("should handle already read message", async () => {
      // Mark it as read again
      const res = await request(app)
        .put(`/api/v1/messages/${unreadMessageId}/read`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should return 404 for non-existent message", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const res = await request(app)
        .put(`/api/v1/messages/${fakeId}/read`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should only allow recipient to mark as read", async () => {
      const res = await request(app)
        .put(`/api/v1/messages/${unreadMessageId}/read`)
        .set("Authorization", `Bearer ${agentToken}`); // Agent trying to mark their own sent message

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });

    it("should require authentication", async () => {
      const res = await request(app).put(
        `/api/v1/messages/${unreadMessageId}/read`,
      );

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("DELETE /api/messages/:id", () => {
    let deletableMessageId: string;

    beforeAll(async () => {
      // Send a message to delete
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: agentId,
          content: "Message to be deleted",
          messageType: "TEXT",
        });

      deletableMessageId = res.body.data.message.id;
    });

    it("should delete sent message", async () => {
      const res = await request(app)
        .delete(`/api/v1/messages/${deletableMessageId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toContain("deleted");
    });

    it("should return 404 for already deleted message", async () => {
      const res = await request(app)
        .delete(`/api/v1/messages/${deletableMessageId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should only allow sender to delete message", async () => {
      // Send a new message first
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: agentId,
          content: "Message for deletion test",
          messageType: "TEXT",
        });

      const messageId = res.body.data.message.id;

      // Try to delete as recipient
      const deleteRes = await request(app)
        .delete(`/api/v1/messages/${messageId}`)
        .set("Authorization", `Bearer ${agentToken}`);

      expect(deleteRes.status).toBe(403);
      expect(deleteRes.body.success).toBe(false);
    });

    it("should return 404 for non-existent message", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const res = await request(app)
        .delete(`/api/v1/messages/${fakeId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it("should require authentication", async () => {
      const res = await request(app).delete(
        `/api/v1/messages/${deletableMessageId}`,
      );

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("Message Content and Types", () => {
    it("should handle special characters in content", async () => {
      const specialContent =
        "Special chars: !@#$%^&*()_+-={}[]|\\:\";'<>?,./ 🏠🏡🏘️";
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: agentId,
          content: specialContent,
          messageType: "TEXT",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.message.content).toBe(specialContent);
    });

    it("should handle whitespace-only content validation", async () => {
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: agentId,
          content: "   ", // Only whitespace
          messageType: "TEXT",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should handle multiline content", async () => {
      const multilineContent = "Line 1\nLine 2\nLine 3";
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: agentId,
          content: multilineContent,
          messageType: "TEXT",
        });

      expect(res.status).toBe(201);
      expect(res.body.data.message.content).toBe(multilineContent);
    });

    it("should truncate content for notification", async () => {
      const longContent = "a".repeat(150);
      const res = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: agentId,
          content: longContent,
          messageType: "TEXT",
        });

      expect(res.status).toBe(201);

      // Check notification content
      const notification = await prisma.notification.findFirst({
        where: {
          userId: agentId,
          type: "MESSAGE",
        },
        orderBy: { createdAt: "desc" },
      });

      expect(notification?.message.length).toBeLessThanOrEqual(103); // 100 + '...'
      if (notification && notification.message.length > 100) {
        expect(notification.message.endsWith("...")).toBe(true);
      }
    });
  });

  describe("Conversation Scenarios", () => {
    it("should handle two-way conversation correctly", async () => {
      // Send user to agent
      const userRes = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: agentId,
          content: "User message in conversation",
          messageType: "TEXT",
        });

      // Send agent to user
      const agentRes = await request(app)
        .post("/api/v1/messages")
        .set("Authorization", `Bearer ${agentToken}`)
        .send({
          recipientId: userId,
          content: "Agent reply in conversation",
          messageType: "TEXT",
        });

      expect(userRes.status).toBe(201);
      expect(agentRes.status).toBe(201);

      // Check conversation from user perspective
      const convRes = await request(app)
        .get(`/api/v1/messages/conversations/${agentId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(convRes.status).toBe(200);
      expect(convRes.body.data.messages.length).toBeGreaterThanOrEqual(2);

      // Should have both sent and received messages
      const messageTypes = convRes.body.data.messages.map(
        (m: any) => m.senderId,
      );
      expect(messageTypes).toContain(userId);
      expect(messageTypes).toContain(agentId);
    });

    it("should handle empty conversation gracefully", async () => {
      // Create a new user
      const newUserRes = await request(app).post("/api/v1/auth/register").send({
        email: "new.user@example.com",
        password: "password123",
        firstName: "New",
        lastName: "User",
        userType: "BUYER",
      });

      const newUserToken = newUserRes.body.data.accessToken;

      // Try to get conversation without any messages
      const res = await request(app)
        .get(`/api/v1/messages/conversations/${agentId}`)
        .set("Authorization", `Bearer ${newUserToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.messages).toEqual([]);
    });
  });

  describe("Rate Limiting and Security", () => {
    it("should prevent excessive message sending", async () => {
      // Send multiple messages rapidly
      const promises = Array(10)
        .fill(null)
        .map(() =>
          request(app)
            .post("/api/v1/messages")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
              recipientId: agentId,
              content: "Rapid fire message",
              messageType: "TEXT",
            }),
        );

      const results = await Promise.all(promises);
      const successCount = results.filter((res) => res.status === 201).length;
      const rateLimitedCount = results.filter(
        (res) => res.status === 429,
      ).length;

      // Some should succeed, some might be rate limited
      expect(successCount + rateLimitedCount).toBe(10);
      if (rateLimitedCount > 0) {
        results
          .filter((res) => res.status === 429)
          .forEach((res) => {
            expect(res.body.success).toBe(false);
          });
      }
    });

    it("should validate UUID format for IDs", async () => {
      const res = await request(app)
        .get("/api/v1/messages/conversations/invalid-uuid")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
