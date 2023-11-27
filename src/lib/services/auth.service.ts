import api from './api.service';
import axios from 'axios';

export class AuthService {

  public static async signinAlternative(email: string, password: string): Promise<any> {
    const apiUrl = process.env.API_BASE_URL || 'http://localhost:8080';
    const response = await axios.post(`${apiUrl}/signin`, {
      email,
      password,
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.statusText);
    }
  }


  public static async signin(email: string, password: string): Promise<any> {
    const response = await api.post('/signin', {
      email,
      password,
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.statusText);
    }
  }

  public static async signup(
    email: string,
    password: string,
    name: string
  ): Promise<any> {
    console.log('signup', email, password, name);

    const response = await api.post('/signup', {
      email,
      password,
      name,
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.statusText);
    }
  }
}
