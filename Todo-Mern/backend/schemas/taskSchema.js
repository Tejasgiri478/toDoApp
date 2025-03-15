/**
 * Validation schemas for task-related routes
 */

export const createTaskSchema = {
  body: {
    required: ['title'],
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 100
      },
      description: {
        type: 'string',
        maxLength: 500
      },
      completed: {
        type: 'boolean'
      },
      category: {
        type: 'string',
        maxLength: 50
      },
      dueDate: {
        type: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}(T\\d{2}:\\d{2}:\\d{2}(\\.\\d{1,3})?(Z|[+-]\\d{2}:\\d{2}))?$',
        patternMessage: 'Due date must be a valid ISO date string'
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high']
      }
    }
  }
};

export const updateTaskSchema = {
  params: {
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}$',
        patternMessage: 'Task ID must be a valid MongoDB ObjectId'
      }
    }
  },
  body: {
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 100
      },
      description: {
        type: 'string',
        maxLength: 500
      },
      completed: {
        type: 'boolean'
      },
      category: {
        type: 'string',
        maxLength: 50
      },
      dueDate: {
        type: 'string',
        pattern: '^\\d{4}-\\d{2}-\\d{2}(T\\d{2}:\\d{2}:\\d{2}(\\.\\d{1,3})?(Z|[+-]\\d{2}:\\d{2}))?$',
        patternMessage: 'Due date must be a valid ISO date string'
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high']
      }
    }
  }
};

export const getTaskSchema = {
  params: {
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}$',
        patternMessage: 'Task ID must be a valid MongoDB ObjectId'
      }
    }
  }
};

export const deleteTaskSchema = {
  params: {
    required: ['id'],
    properties: {
      id: {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}$',
        patternMessage: 'Task ID must be a valid MongoDB ObjectId'
      }
    }
  }
};

export const getTasksSchema = {
  query: {
    properties: {
      completed: {
        type: 'string',
        enum: ['true', 'false']
      },
      category: {
        type: 'string'
      },
      priority: {
        type: 'string',
        enum: ['low', 'medium', 'high']
      },
      sort: {
        type: 'string',
        enum: ['createdAt', '-createdAt', 'dueDate', '-dueDate', 'title', '-title']
      },
      page: {
        type: 'string',
        pattern: '^[0-9]+$',
        patternMessage: 'Page must be a positive integer'
      },
      limit: {
        type: 'string',
        pattern: '^[0-9]+$',
        patternMessage: 'Limit must be a positive integer'
      }
    }
  }
};