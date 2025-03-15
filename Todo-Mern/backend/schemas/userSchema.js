/**
 * Validation schemas for user-related routes
 */

export const registerSchema = {
  body: {
    required: ['name', 'email', 'password'],
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 50
      },
      email: {
        type: 'string',
        pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$',
        patternMessage: 'Email must be a valid email address'
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 100
      }
    }
  }
};

export const loginSchema = {
  body: {
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$',
        patternMessage: 'Email must be a valid email address'
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 100
      }
    }
  }
};

export const forgotPasswordSchema = {
  body: {
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$',
        patternMessage: 'Email must be a valid email address'
      }
    }
  }
};

export const resetPasswordSchema = {
  body: {
    required: ['token', 'password'],
    properties: {
      token: {
        type: 'string'
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 100
      }
    }
  }
};

export const updateProfileSchema = {
  body: {
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 50
      },
      email: {
        type: 'string',
        pattern: '^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$',
        patternMessage: 'Email must be a valid email address'
      }
    }
  }
}; 