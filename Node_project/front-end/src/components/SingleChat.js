import { ArrowBackIcon } from '@chakra-ui/icons';
import { Box, Text } from '@chakra-ui/layout';
import { IconButton } from '@chakra-ui/button';
import { React, useEffect, useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import {getSender, getSenderFull} from '../config/ChatLogics'
import ProfileModel from './miscellaneous/ProfilModel'
import UpdateGroupChatModel from './miscellaneous/UpdateGroupChatModel'
import { FormControl, Input, Spinner, useToast } from '@chakra-ui/react';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import '../components/index.css'
import io from 'socket.io-client'

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {

  const {user, selectedChat, setSelectedChat} = ChatState()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState()
  const [socketConnected, setSocketConnected] = useState(false)
  const toast = useToast()

  const fetchMessage = async()=>{
    if(!selectedChat) return;

    try {

      const config = {
        headers: {
        Authorization: `Bearer ${user.token}`,
        },

      };
      setLoading(true)
      const {data} = await axios.get(`/api/message/${selectedChat._id}`, config)
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }

  }

    useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit('setup',user);
    socket.on('connection',()=> setSocketConnected(true))
  }, []);

  useEffect(() => {
      fetchMessage();
      selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id)
      {
        //give notif 
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) =>{
    if(event.key === "Enter" && newMessage){
      try {
        const config = {
        headers: {
          "Centent-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      setNewMessage("");
      const {data}= await axios.post('/api/message',{
        content: newMessage,
        chatId: selectedChat._id,
      },config)

      socket.emit("new message", data)
      setMessages([...messages, data])
      } catch (error) {
        toast({
        title: "Error Occured!",
        description: "Failed to send the Messgae",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      }
    }
  }

  const typingHandler = (e)=>{
    setNewMessage(e.target.value)
  }

  return ( <>{
    selectedChat ? (
      <>
        <Text fontSize={{base:"28px", md:"30"}} pb={3} px={3} w="100%" fontFamily="Work Sans" d="flex" justifyContent={{base: "space-between"}} alignItems="center" > 
          <IconButton d={{base: "flex", md: "none"}} icon={<ArrowBackIcon/>} onClick={() => setSelectedChat("")} />
          {!selectedChat.isGroupChat ?(
            <>
              {getSender (user,selectedChat.users)}
              <ProfileModel user={getSenderFull (user,selectedChat.users)} />
            </>
          ) : (
            <>
              {selectedChat.chatName.toUpperCase()}
              <UpdateGroupChatModel fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessage={fetchMessage}/>
            </>
          )}
        </Text>
        <Box 
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden">

            {loading?(
              <Spinner
              size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ):(
              <div className='scrollbar' >
                <ScrollableChat messages={messages} />
              </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input  variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
        </Box>
      </>
    ):(
      <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
    )
  }</>);
  
};

export default SingleChat
