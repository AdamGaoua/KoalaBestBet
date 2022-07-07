import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_BASE_URL}`,
    headers: {
      'Content-Type': 'application/json',
      
  }});

export function RequestToRanking(){
    const response = axiosInstance.get('/list/rank/limited');
    return response;
}
export function RequestToToken (data){
    const response = axiosInstance.post('/login-action',data);
    return response;
}

export function RequestToLogin(userId){
    const response = axiosInstance.get(`/infos/user/${userId}`);
    return response;
}

export function RequestToSignup(data){
    const response = axiosInstance.put('/signup-action', data);
    return response;
}

export function RequestToMatchsIncoming(){
    const response = axiosInstance.get('/list/matchs/upcoming');
    return response;
}

export function RequestToCreateGroup(data, matchSelected){
    const response = axiosInstance.put('/create-group', {name : data.name, nbJoueurs: parseInt(data.nbJoueurs), matchs_id: matchSelected});
    return response;
}

export function RequestToJoinGroup(link){
    const response = axiosInstance.get(`/invite/${link}`)
    return response;
}

export function RequestToListsGroups(id){
    const response = axiosInstance.get(`/list/groups/user/${id}`)
    return response;
}

export function RequestToDeleteGroup(id){
    const response = axiosInstance.delete(`/delete-group/group/${id}`);
    return response;
}

export function RequestToListsMatchs(id){
    const response = axiosInstance.get(`/list/matchs/group/${id}`);
    return response;
}

export function RequestToVerifyBet(id){
    const response = axiosInstance.patch(`/verify-bet/group/${id}`);
    return response;
}

export function RequestToUpdatePoints(id){
    const response = axiosInstance.get(`/update-points/group/${id}`);
    return response;
}

export function RequestToRankingGroup(id){
    const response = axiosInstance.get(`/list/rank/group/${id}`);
    return response;
}

export function RequestToUpdateUser(id, data){
    const response = axiosInstance.patch(`/infos/user/${id}`, {username : data.username, firstname: data.firstname, lastname:data.lastname, email:data.email, password: data.password });
    return response;
}

export function RequestToDeleteUser(id){
    const response = axiosInstance.delete(`/delete-account/${id}`);
    return response;
}
export function saveAuthorization(token){
    axiosInstance.defaults.headers.common.Authorization = `bearer ${token}`;
}


