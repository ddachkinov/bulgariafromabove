const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  getToken() {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    // Check content type before parsing
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    try {
      if (isJson) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { error: text || 'Invalid response format' };
      }
    } catch (parseError) {
      throw new Error('Failed to parse server response');
    }

    if (!response.ok) {
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  }

  // Auth endpoints
  async register(email: string, username: string, password: string) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
  }

  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    this.setToken(null);
    return this.request('/api/auth/logout', { method: 'POST' });
  }

  // Game endpoints
  async startGame(mode: 'classic' | '5-round') {
    return this.request('/api/game/start', {
      method: 'POST',
      body: JSON.stringify({ mode }),
    });
  }

  async submitGuess(
    gameId: string,
    guessLat: number,
    guessLng: number,
    timeSpent: number
  ) {
    return this.request(`/api/game/${gameId}/round`, {
      method: 'POST',
      body: JSON.stringify({ guessLat, guessLng, timeSpent }),
    });
  }

  async completeGame(gameId: string) {
    return this.request(`/api/game/${gameId}/complete`, {
      method: 'POST',
    });
  }

  // Leaderboard endpoints
  async getLeaderboard(
    period: 'daily' | 'weekly' | 'alltime',
    page = 1,
    limit = 20
  ) {
    return this.request(
      `/api/leaderboard/${period}?page=${page}&limit=${limit}`
    );
  }

  // User endpoints
  async getProfile() {
    return this.request('/api/user/profile');
  }

  async getStats() {
    return this.request('/api/user/stats');
  }

  async updateProfile(data: { username?: string; avatarId?: string }) {
    return this.request('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Feedback endpoints
  async submitFeedback(subject: string, message: string, deviceInfo?: string) {
    return this.request('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ subject, message, deviceInfo }),
    });
  }
}

export const api = new ApiClient(API_URL);
