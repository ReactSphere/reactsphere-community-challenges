# Week 2 challenge - Simple Counter App

## Objective

Create a counter app there you will show three button : Increase, Decrease, Reset and Show The count over the buttons.

## Requirements

- Create a `Counter` Component.
- Declare a state name of count and setCount.
- Make three buttons : Increase, Decrease, Reset and give them event handler by function like: function handleIncrement and handleDecrement and handleReset.
- If someone click on increase button the count will be increase and If someone click on decrease button the count will be decrease before going to 0 and If someone click on reset button the count will be 0 before going to 0.
- Display: `0` initially;

## Submission

- Branch: `week-2-solution`
- Submit PR to this repository
- Include your GitHub username in the PR title

## Points

- Challenge completed: 15 points
- PR merged: 10 points

---

### Solution by @mahmudul-Hasan-2

```javascript
import React from "react";

function Greeting() {
  const [count, setCount] = useState(0);
  function handleIncrement () {
    setCount(count + 1);
  }
  function handleDecrement () {
    count > 0 && setCount(count - 1);
  }
  function handleReset () {
    count > 0 setCount(0);
  }
  return (
    <div>
        <h2>{count}</h2>
        <button onClick={handleIncrement}>Increment</button>
        <button onClick={handleDecrement}>Decrement</button>
        <button onClick={handleReset}>Reset</button>
    </div>
  )
}

export default Greeting;
```