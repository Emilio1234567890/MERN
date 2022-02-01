import {React, useEffect} from 'react'
import {Container,Box,Text,Tabs,TabList,Tab,TabPanels,TabPanel} from '@chakra-ui/react'
import Login from '../components/Authentification/Login'
import Signup from '../components/Authentification/Signup'
import { useHistory } from 'react-router-dom'

const Homepage = () => {
    const history = useHistory();

    useEffect(() => {
      const user = JSON.parse(localStorage.getItem('userInfo'));
      

      if(user) history.push('/chats');
    
    }, [history])

    return (
        <Container maxW='xl' centerContent>
            <Box d='flex' justifyContent='center' p={3} bg={'white'} m='40px 0 15px 0' w='100%' borderRadius='lg' borderWidth='1px'>
                <Text fontSize='4xl' fontFamily='Work sans' color='black'>
                    Talk in real time
                </Text>
            </Box>
            <Box bg="white" width='100%' p={4} borderRadius='lg'color='black' borderWidth='1px'>
                <Tabs variant='soft-rounded' colorScheme='green'>
                    <TabList mb='1em'>
                        <Tab width='50%'>Login</Tab>
                        <Tab width='50%'>Sing Up</Tab>
                    </TabList>
                    <TabPanels>
                        <TabPanel>
                        <Login/>
                        </TabPanel>
                        <TabPanel>
                        <Signup/>
                        </TabPanel>
                    </TabPanels>
                </Tabs>
            </Box>
            
        </Container>
    )
}

export default Homepage
