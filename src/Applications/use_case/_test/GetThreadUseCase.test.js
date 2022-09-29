const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const thread = {
      id: 'thread-123',
      title: "We think you'll love this",
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      date: '20220909',
      username: 'chilltude',
    };
    const comments = [
      {
        id: 'comment-123',
        username: 'chilltude',
        date: '20220909',
        content: 'nice comment, right?',
        is_deleted: false,
      },
      {
        id: 'comment-123',
        username: 'chilltude',
        date: '20220909',
        content: 'ugh!',
        is_deleted: true,
      },
    ];
    const expectedThread = {
      id: 'thread-123',
      title: "We think you'll love this",
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      date: '20220909',
      username: 'chilltude',
      comments: [
        {
          id: 'comment-123',
          username: 'chilltude',
          date: '20220909',
          content: 'nice comment, right?',
        },
        {
          id: 'comment-123',
          username: 'chilltude',
          date: '20220909',
          content: '**komentar telah dihapus**',
        },
      ],
    };

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.verifyAvailableThread = jest.fn(() => Promise.resolve());
    mockThreadRepository.getThreadById = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsThread = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getThread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(getThread).toEqual(expectedThread);
    expect(mockThreadRepository.verifyAvailableThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockThreadRepository.getThreadById)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
  });
});
