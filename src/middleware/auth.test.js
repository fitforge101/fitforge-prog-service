process.env.JWT_SECRET = 'test_secret_for_jest_validation';
const jwt = require('jsonwebtoken');
const auth = require('./auth');

describe('Auth Middleware Validation', () => {
  let mockReq;
  let mockRes;
  let nextFunction;

  // Run before every test
  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
    
  });

  it('Scenario 1: Should block request with 401 if Authorization header is missing', () => {
    auth(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(nextFunction).not.toHaveBeenCalled(); // The route is never hit
  });

  it('Scenario 2: Should block request with 401 if token format is invalid', () => {
    mockReq.headers.authorization = 'just_the_token_without_bearer_prefix';

    auth(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('Scenario 3: Should block request with 401 if the token is tampered with or signed by unknown source', () => {
    // A hacker signs a token using their own secret key
    const maliciousToken = jwt.sign({ id: 'hacker123' }, 'malicious_secret_key');
    mockReq.headers.authorization = `Bearer ${maliciousToken}`;

    auth(mockReq, mockRes, nextFunction);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('Scenario 4: Should attach decoded user and proceed to route if the token is completely valid', () => {
    const validUserPayload = { id: 'admin555', role: 'admin' };
    
    // Server signs token securely with matching environment secret
    const validToken = jwt.sign(validUserPayload, process.env.JWT_SECRET);
    
    mockReq.headers.authorization = `Bearer ${validToken}`;

    auth(mockReq, mockRes, nextFunction);

    // Assert that the decoded user is now embedded on the request object
    expect(mockReq.user.id).toBe('admin555');
    
    // Assert that the route is permitted to proceed!
    expect(nextFunction).toHaveBeenCalledTimes(1); 
  });
});
