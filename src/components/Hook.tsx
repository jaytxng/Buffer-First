import React, { useState, useEffect } from 'react';

interface Initial { initial: number; }

const Hook = (props: Initial) => {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(props.initial);

  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  }, [count]);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + 1); // This effect depends on the `count` state
    }, 1000);
    return () => clearInterval(id);
  }, []);
  
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

Hook.displayName = 'Hook';

export default Hook;
