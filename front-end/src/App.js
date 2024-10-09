import * as React from 'react'
import { ChakraBaseProvider, ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraBaseProvider>
      <div className="App">
          <h1>
            Ticketing app
          </h1>
      </div> 
    </ChakraBaseProvider>
  );
}

export default App;
