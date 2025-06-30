// Mock API implementation using localStorage
class ApiClient {
  constructor() {
    this.initializeStorage();
  }

  initializeStorage() {
    // Initialize storage if not exists
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('todos')) {
      localStorage.setItem('todos', JSON.stringify([]));
    }
  }

  // Simulate network delay
  async delay(ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Helper methods for localStorage operations
  getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }

  setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  getTodosFromStorage() {
    return JSON.parse(localStorage.getItem('todos') || '[]');
  }

  setTodosInStorage(todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }

  generateToken(user) {
    // Simple mock JWT token
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      id: user.id, 
      email: user.email, 
      exp: Date.now() / 1000 + 24 * 60 * 60 // 24 hours from now
    }));
    const signature = btoa('mock-signature');
    return `${header}.${payload}.${signature}`;
  }

  // Auth endpoints
  async register(userData) {
    await this.delay();
    
    const users = this.getUsers();
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In real app, this would be hashed
      verified: false,
      verificationCode: verificationCode,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.setUsers(users);

    // Store the verification code temporarily for demo purposes
    localStorage.setItem('tempVerificationCode', verificationCode);
    localStorage.setItem('tempVerificationEmail', userData.email);

    return {
      message: 'Registration successful. Please check your email for verification code.',
      user: { id: newUser.id, email: newUser.email },
      // In demo mode, return the verification code
      verificationCode: verificationCode
    };
  }

  async verifyEmail(code, email) {
    await this.delay();
    
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (user.verificationCode !== code) {
      throw new Error('Invalid verification code');
    }

    user.verified = true;
    delete user.verificationCode;
    this.setUsers(users);

    // Clean up temporary storage
    localStorage.removeItem('tempVerificationCode');
    localStorage.removeItem('tempVerificationEmail');

    return {
      message: 'Email verified successfully',
      user: { id: user.id, email: user.email }
    };
  }

  async login(credentials) {
    await this.delay();
    
    const users = this.getUsers();
    const user = users.find(u => 
      u.email === credentials.email && 
      u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.verified) {
      throw new Error('Please verify your email before logging in');
    }

    const token = this.generateToken(user);
    localStorage.setItem('token', token);

    return {
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email }
    };
  }

  async getProfile() {
    await this.delay();
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const users = this.getUsers();
    const user = users.find(u => u.id === currentUser.id);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      user: { id: user.id, email: user.email }
    };
  }

  // Todo endpoints
  async getTodos() {
    await this.delay();
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const todos = this.getTodosFromStorage();
    const userTodos = todos.filter(todo => todo.userId === currentUser.id);

    return { todos: userTodos };
  }

  async createTodo(todoData) {
    await this.delay();
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const todos = this.getTodosFromStorage();
    const newTodo = {
      id: Date.now().toString(),
      title: todoData.title,
      description: todoData.description || '',
      dueDate: todoData.dueDate || null,
      completed: false,
      userId: currentUser.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    todos.push(newTodo);
    this.setTodosInStorage(todos);

    return { todo: newTodo };
  }

  async updateTodo(id, todoData) {
    await this.delay();
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const todos = this.getTodosFromStorage();
    const todoIndex = todos.findIndex(todo => 
      todo.id === id && todo.userId === currentUser.id
    );

    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...todoData,
      updatedAt: new Date().toISOString()
    };

    this.setTodosInStorage(todos);

    return { todo: todos[todoIndex] };
  }

  async deleteTodo(id) {
    await this.delay();
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const todos = this.getTodosFromStorage();
    const todoIndex = todos.findIndex(todo => 
      todo.id === id && todo.userId === currentUser.id
    );

    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    todos.splice(todoIndex, 1);
    this.setTodosInStorage(todos);

    return { message: 'Todo deleted successfully' };
  }

  async toggleTodo(id) {
    await this.delay();
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const todos = this.getTodosFromStorage();
    const todoIndex = todos.findIndex(todo => 
      todo.id === id && todo.userId === currentUser.id
    );

    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }

    todos[todoIndex].completed = !todos[todoIndex].completed;
    todos[todoIndex].updatedAt = new Date().toISOString();

    this.setTodosInStorage(todos);

    return { todo: todos[todoIndex] };
  }
}

export default new ApiClient();