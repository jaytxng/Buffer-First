import React from 'react';
import Monitor from './Monitor';
// Two examples showing styled components/CSS modules and react hooks:
// import Hello from "./Hello";
// import Hook from "./Hook";

const AppContainer = (props: any) => {    
  // Example with styling: <Hello compiler="TypeScript" framework="React" />
  // Example with React Hooks: <Hook initial={0} />
  return (
    <>
      <Monitor/>
    </>
  );
}

AppContainer.displayName = 'AppContainer'

export default AppContainer;