import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}`,
    headers: {
      'Content-Type': 'application/json',
      
  }});

export async function RequestToToken (data){
    const response = axiosInstance.post('/login-action',data);
    return response;
}

export async function RequestToLogin(userId){
    const response = axiosInstance.get(`/infos/user/${userId}`);
    return response;
}

export async function RequestToSignup(data){
    const response = axiosInstance.put('/signup-action', data);
    return response;
}

export function saveAuthorization(token){
    axiosInstance.defaults.headers.common.Authorization = `bearer ${token}`;
}


