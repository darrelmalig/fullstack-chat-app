import {create} from "zustand"
import toast from "react-hot-toast"
import {axiosInstance} from "../lib/axios.jsx"
import { useAuthStore } from "./useAuthStore.jsx";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    isSending: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const response = await axiosInstance.get("/messages/users");
          set({ users: response.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading: true})
        try{
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({messages: response.data})
        }catch(error){
            toast.error(error.response.data.message);
        }finally{
            set({isMessagesLoading: false})
        }
    },

    sendMessage: async (messageData) => {
      set({ isSending: true });
      const { selectedUser, messages } = get();
      try {
        const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
        set({ messages: [...messages, response.data] });
        toast.success("Message sent");
      } catch (error) {
        toast.error(error.response.data.message);
      }finally{
        set({isSending: false})
    }
    },

    subscribeToMessages: () => {
      const {selectedUser} = get();
      if(!selectedUser) return

      const socket = useAuthStore.getState().socket;

      socket.on("newMessage", (newMessage) => {

        const isMessageSentFromSelectedUser = newMessage.senderId !== selectedUser._id;
        if(isMessageSentFromSelectedUser) return

        set({
          messages: [...get().messages, newMessage],
        })
      })
    },

    unsubscribeFromMessages: () => {
      const socket = useAuthStore.getState().socket;
      socket.off("newMessage")
    },

    setSelectedUser: async (selectedUser) => set({selectedUser})
}))