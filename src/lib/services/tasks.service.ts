import axios, { AxiosRequestConfig } from 'axios';
import api from './api.service';

export class TaskService {
  private static async handleRequest(request: Promise<any>): Promise<any> {
    return request
      .then(async (response) => await response.data)
      .catch((error) => {
        console.log('error', error);
        throw new Error(error.response?.data || 'Erro na solicitação');
      });
  }

  private static addAuthorizationHeader(
    config: AxiosRequestConfig
  ): AxiosRequestConfig {
    const user = localStorage.getItem('user');
    if (user) {
      const { token } = JSON.parse(user);
      config.headers = {
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  }

  public static async getTasks(): Promise<any> {
    const response = await api.get('/tasks');
    console.log('response getTasks', response);
    return response.data;
  }

  public static async getTask(id: number): Promise<any> {
    const response = await axios.get(`http://localhost:8080/tasks/${id}`);

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.statusText);
    }
  }

  public static async createTask(
    title: string,
    description: string,
    tags: string[],
    userId: number
  ): Promise<any> {
    const config: AxiosRequestConfig = {};
    const apiUrl = process.env.API_BASE_URL || 'http://localhost:8080';
    const response = await axios.post(
      `${apiUrl}/tasks`,
      {
        title,
        description,
        tags,
        userId,
      },
      TaskService.addAuthorizationHeader(config)
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.statusText);
    }
  }

  public static async updateTask(
    id: number,
    title: string,
    description: string,
    tags: string[],
    userId: number
  ): Promise<any> {
    const response = await api.put(`/tasks/${id}`, {
      title,
      description,
      tags,
      userId,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.statusText);
    }
  }

  public static async deleteTask(id: number): Promise<any> {
    const config: AxiosRequestConfig = {};
    const apiUrl = process.env.API_BASE_URL || 'http://localhost:8080';
    const response = await axios.delete(
      `${apiUrl}/tasks/${id}`,
      TaskService.addAuthorizationHeader(config)
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.statusText);
    }
  }
}
