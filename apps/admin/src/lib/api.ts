const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

class AdminApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('admin_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('admin_token', token);
      } else {
        localStorage.removeItem('admin_token');
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Don't set Content-Type for FormData (browser will set it with boundary)
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'An error occurred');
    }

    return data;
  }

  // Photo endpoints
  async uploadPhoto(photoData: {
    url: string;
    thumbnailUrl: string;
    latitude: number;
    longitude: number;
    city?: string;
    region?: string;
    category?: string;
    difficulty?: number;
  }) {
    return this.request('/api/photos', {
      method: 'POST',
      body: JSON.stringify(photoData),
    });
  }

  async getPhotos(params: {
    page?: number;
    limit?: number;
    approved?: boolean;
    category?: string;
  }) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.approved !== undefined) query.append('approved', params.approved.toString());
    if (params.category) query.append('category', params.category);

    return this.request(`/api/photos?${query.toString()}`);
  }

  async updatePhoto(id: string, data: any) {
    return this.request(`/api/photos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePhoto(id: string) {
    return this.request(`/api/photos/${id}`, {
      method: 'DELETE',
    });
  }

  async login(email: string, password: string) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }
}

export const adminApi = new AdminApiClient(API_URL);
