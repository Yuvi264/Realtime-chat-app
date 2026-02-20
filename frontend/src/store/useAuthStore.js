import {create} from "zustand";
import {axiosInstance} from "../lib/axios";
import axios from "axios";
import {toast} from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL=import.meta.Mode=="development"?"http://localhost:3000":"/"
export const useAuthStore=create((set, get)=>({
    
    authUser:null,
    onlineUsers: [],
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,    
    isCheckingAuth:true,
    socket:null,
    checkAuth: async ()=>{
        try{
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data.user})
            get().connectSocket();
        }catch(error){
            console.log("Error in checkAuth:",error);
            set({authUser:null})
        }finally{
            set({isCheckingAuth:false})
        }
    },
    signup: async(data)=>{
      set({isSigningUp:true});
      try{
      const res=await axiosInstance.post("/auth/signup",data);  
      toast.success("Account create successfully")
      set({authUser:res.data})
        get().connectSocket();
      } catch(error){
        toast.error(error.response.data.message)
        console.log("Error in signup:",error);
      }finally{
        set({isSigningUp:false})
      }
    },
    login: async(data)=>{
        set({isLoggingIng:true});
        try{
        const res=await axiosInstance.post("/auth/login",data);  
        toast.success("Logged in successfully")
        console.log("Login response:", res.data);
        set({authUser:res.data})
        get().connectSocket();
        } catch(error){
          toast.error(error.response.data.message)
          console.log("Error in login:",error);
        }finally{
          set({isLoggingIng:false})
        }
    },
    logout:async()=>{
        try{
            await axiosInstance.post("auth/logout");
            set({authUser:null})
            toast.success("logged out successfully")
            get().disconnectSocket();
        }
        catch(error){
            console.log("Error in logout:",error);
            toast.error("Failed to logout")
        }
    },
    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});                                                                                                          
        try{
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data})
            toast.success("Profile updated successfully")
        }catch(error){
            toast.error(error.response.data.message)
        }finally{
            set({isUpdatingProfile:false})
        }
    },
    connectSocket:()=>{
        const {authUser}=get();
        if(!authUser || get().socket?.connected) return;
        const socket=io(BASE_URL,{
            query:{userId:authUser._id}
        });
        socket.connect()
        set({socket: socket});
        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },
    disconnectSocket:()=>{
        if(get().socket){
            get().socket.disconnect();
        }
    }
}))