const GetThread = require('../GetThread');

describe('a getThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: "We think you'll love this",
    };

    // Action and assret
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data types specification', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: "We think you'll love this",
      body: true,
      date: '22-09-2022',
      username: 'user-123',
    };

    // Action and assert
    expect(() => new GetThread(payload)).toThrowError('GET_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create GetThread object correctly', () => {
    // Arrange
    const payload = {
      id: 'thread-123',
      title: "We think you'll love this",
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      date: '22-09-2022',
      username: 'user-123',
    };

    // Action
    const {
      id, title, body, date, username,
    } = new GetThread(payload);

    // assert
    expect(id).toEqual(payload.id);
    expect(title).toEqual(payload.title);
    expect(body).toEqual(payload.body);
    expect(date).toEqual(payload.date);
    expect(username).toEqual(payload.username);
  });
});
