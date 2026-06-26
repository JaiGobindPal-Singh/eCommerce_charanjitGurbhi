import {create} from 'zustand';

const userStore = create((set)=>({
    name: "",
    id: "",
    phone: "",
    role: "",
    setUser: (user)=> set({...user})  //set the user
}));

export default userStore;