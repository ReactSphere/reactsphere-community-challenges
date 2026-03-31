import React, { useState } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);
  function handleIncrease() {
    setCount(count + 1);
  }
  function handleDecrease() {
    count > 0 && setCount(count - 1);
  }
  function handleReset() {
    count > 0 && setCount(0);
  }
  return (
    <div>
      <h2>{count}</h2>
      <button onClick={handleIncrease}>Increase</button>
      <button onClick={handleDecrease}>Decrease</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default Counter;
