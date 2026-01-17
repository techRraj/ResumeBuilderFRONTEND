import React, { useState } from 'react';

const TestEditor = () => {
  const [name, setName] = useState('Test User');
  
  return (
    <div style={{ padding: 20 }}>
      <h1>Test Editor</h1>
      <input 
        type="text" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
      />
      <p>Hello, {name}!</p>
    </div>
  );
};

export default TestEditor;