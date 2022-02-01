import { Button } from '@chakra-ui/button'
import { VStack } from '@chakra-ui/layout'
import { FormControl, FormLabel } from '@chakra-ui/form-control'
import React,{useState} from 'react'
import { Input,InputGroup,InputRightElement } from '@chakra-ui/input'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import {useHistory} from 'react-router-dom'

const Singup = () => {
const [show, setShow] = useState(false);
const handleClick = ()=>setShow(!show);
const toast = useToast();
const history = useHistory();

const [name, setName] = useState()
const [email, setEmail] = useState()
const [confirmpassword, setConfirmpassword] = useState()
const [password, setPassword] = useState()
const [pic, setPic] = useState()
const [loading, setLoading] = useState(false);




const postDetails  = (pics) => {
    setLoading(true);
    if(pics === undefined){
        toast({
          title: 'Please select a image',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        return;
    }

    if(pics.type ==="image/jpeg" || pics.type ==="image/png"){
        const data = new FormData();
        data.append("file",pics);
        data.append("upload_preset","chat-app")
        data.append("cloud_name","dsb86kete")
        fetch("https://api.cloudinary.com/v1_1/dsb86kete/image/upload", {
            method: 'post', body:data,
        }).then((res) => res.json())
        .then((data)=>{
            setPic(data.url.toString());
            setLoading(false);
        })
        .catch((err) =>{
            console.log(err);
            setLoading(false);
        })
    }else{
        toast({
          title: 'Please select a image',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        setLoading(false)
        return;
    }
};
const submitHandler = async () =>{
    setLoading(true);
    if(!name || !email || !password || !confirmpassword){
       toast({
          title: "Please fill all the fields",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position:"bottom",
        });
        setLoading(false);
        return;
    }
    if(password !== confirmpassword){
        toast({
          title: "Passwords do not match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position:"bottom",
        });
        setLoading(false);
        return;
    }

    try {
        const config = {
            headers: {
                "Content-type": "application/json",
            },
        };
        const {data} = await axios.post("/api/user",{name,email,password,pic},config);
        console.log(data);
        toast({
          title: 'Registration Successful',
          status: 'succes',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        
        localStorage.setItem('userInfo',JSON.stringify(data));
        setLoading(false);
        history.push('/chats');

    } catch (error) {
        toast({
          title: 'Error Occured',
          description: error.response.data.message,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:'bottom',
        });
        setLoading(false);
    }
};

    return (
        <VStack spacing='5px' color='black'>
            <FormControl id='first-name' isRequired>
                <FormLabel>
                    Name
                </FormLabel>
                <Input placeholder='Enter your Name' onChange={(e)=>setName(e.target.value)}/>
                
            </FormControl>
            <FormControl id='email' isRequired>
                <FormLabel>
                    Email
                </FormLabel>
                <Input placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)}/>
                
            </FormControl>
           
            <FormControl id='password' isRequired> 
                <FormLabel>
                    Password
                </FormLabel>
                <InputGroup>
                    <Input placeholder='Enter your password'type={show ?"text":'password'} onChange={(e)=>setPassword(e.target.value)}/>
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            
            <FormControl id='password' isRequired> 
                <FormLabel>
                   Confirm Password
                </FormLabel>
                <InputGroup>
                    <Input placeholder='Confirm your password'type={show ?"text":'password'} onChange={(e)=>setConfirmpassword(e.target.value)}/>
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <FormControl id='pic'> 
                <FormLabel>
                    Upload your Picture
                </FormLabel>
                
                <Input type="file" p={1.5} accept='image/*'  onChange={(e)=>postDetails(e.target.files[0])}/>    
            </FormControl>
            <Button colorScheme="blue" width="100%" style={{marginTop:15}} onClick={submitHandler} isLoading={loading}>
                Sign Up
            </Button>

        </VStack>
    )
}

export default Singup
