import SideBar from "./component/side-bar/side-bar";
import * as React from 'react';
import { ChakraProvider } from '@chakra-ui/react'


function App() {
  return (
    <ChakraProvider>
      <div>
        <SideBar />
      </div>
    </ChakraProvider>
  )}

  export default App;
