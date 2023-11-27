import axios, { AxiosRequestConfig } from 'axios';

export class UserService {

    private static handleRequest(request: Promise<any>): Promise<any> {
        return request.then((response) => response.data).catch((error) => {
            throw new Error(error.response?.data || 'Erro na solicitação');
        });
    }

    private static addAuthorizationHeader(config: AxiosRequestConfig): AxiosRequestConfig {

        const user = localStorage.getItem('user');
        if (user) {
            const { token } = JSON.parse(user);
            config.headers = {
                Authorization: `Bearer ${token}`,
            };
        }

        return config;
    }


    public static getUsers(token?: string): Promise<any> {
        const config: AxiosRequestConfig = {};
        const apiUrl = process.env.API_BASE_URL || 'http://localhost:8080';
        return UserService.handleRequest(axios.get(`${apiUrl}/users`, UserService.addAuthorizationHeader(config)));
    }


    public static async getUser(id: number): Promise<any> {
        const apiUrl = process.env.API_BASE_URL || 'http://localhost:8080';
        const response = await axios.get(`${apiUrl}/users/${id}`);

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(response.statusText);
        }
    }

}