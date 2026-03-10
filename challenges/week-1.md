# Week 1 Challenge - Greeting Component

## Objective
Create a simple React component that displays a greeting.

## Requirements
- Create a `Greeting` component.
- Accept a `name` prop.
- Display: `Hello, [name]! Welcome to ReactSphere.`

## Submission
- Branch: `week-1-solution`
- Submit PR to this repository
- Include your GitHub username in the PR title

## Points
- Challenge completed: 15 points
- PR merged: 10 points


-----------------------------------------------------------------------------------------------------------------------------------------------------

### Solution by @jaseel0

```javascript
import React from 'react';

function Greeting({ name }) {
  return <h1>Hello, {name}! Welcome to ReactSphere.</h1>;
}

export default Greeting;
