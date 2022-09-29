const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ServerTableTestHelper = require('../../../../tests/ServerTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/threads/{threadId}/comments endpoint', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({});
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should response 201 and persisted comment', async () => {
      // Arrange
      const payload = {
        content: 'nice comment, right?',
      };
      const server = await createServer(container);
      await ThreadsTableTestHelper.addThread({});
      const accessToken = await ServerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/comments',
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data).toBeDefined();
    });

    it('should response 401 when payload not had access token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/thread-123/comments',
        payload: {},
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 400 when payload not contain needed property', async () => {
    // Arrange
      const payload = {};
      const server = await createServer(container);
      await ThreadsTableTestHelper.addThread({});
      const accessToken = await ServerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/comments',
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 400 when payload not meet data type specification', async () => {
    // Arrange
      const payload = {
        content: true,
      };
      const server = await createServer(container);
      await ThreadsTableTestHelper.addThread({});
      const accessToken = await ServerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/comments',
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 404 when thread not available', async () => {
    // Arrange
      const payload = {
        content: 'nice comment, right?',
      };
      const server = await createServer(container);
      const accessToken = await ServerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        url: '/threads/thread-123/comments',
        method: 'POST',
        payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 404 when comment not found', async () => {
    // Arrange
      const threadId = 'thread-123';
      const commentId = 'comment-9797';

      const server = await createServer(container);

      await ThreadsTableTestHelper.addThread({});

      const accessToken = await ServerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        url: `/threads/${threadId}/comments/${commentId}`,
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 200 and return success', async () => {
      // Arrange
      const commentId = 'comment-123';
      const threadId = 'thread-123';

      await ThreadsTableTestHelper.addThread({});
      await CommentsTableTestHelper.addComment({});

      const server = await createServer(container);

      const accessToken = await ServerTableTestHelper.getAccessToken();

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
