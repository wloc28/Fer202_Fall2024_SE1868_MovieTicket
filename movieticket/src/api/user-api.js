import axios from "axios";

const api = "http://localhost:9999/users";

//login
export const login = async (user) => {
    try{
        console.log(user)
        const response = await axios.get(api);
        const users = response.data;
        const found = users.find(u => u.email == user.email && u.password == user.password);
        console.log(found);
        console.log(users);
        if(found){
            return found;
        }
        throw new Error("Not Correct email or Password");
    }catch(error){
        throw error;
    }
}

//register
export const register = async (user) => {
    try{
      const response = await axios.get(api);
      const users = response.data;
      const found = users.find(u => u.email == user.email && u.password == user.password);
      if(found){
          throw new Error("Email Already Exists");
      }

      user.id = (users.length + 2).toString();
      const res = await axios.post(api, {
        ...user,
        role: "guest"
      });
      return res.data;
    }catch(error){
        throw error;
    }
}

//getUsers
export const getUsers = async () => {
    try{
        const response = await axios.get(api);
        return response.data;
    }catch(error){
        throw error;
    }
}

//deleteUser
export const deleteUser = async (id) => {
    try{
        const response = await axios.delete(`${api}/${id}`);
        return response.data;
    }catch(error){
        throw error;
    }
}

//updateUser
export const updateUser = async (user) => {
    try{
        const response = await axios.put(`${api}/${user.id}`, user);
        return response.data;
    }catch(error){
        throw error;
    }
}

//getUser
export const getUser = async (id) => {
    try{
        const response = await axios.get(`${api}/${id}`);
        return response.data;
    }catch(error){
        throw error;
    }
}

//createUser
export const createUser = async (user) => {
    try{
        //random
        user.id = (Math.floor(Math.random() * 1000)).toString();
        const response = await axios.post(api, user);
        return response.data;
    }catch(error){
        throw error
    }
}