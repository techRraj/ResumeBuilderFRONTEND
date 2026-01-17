// Example: Create a component like 'components/ui/ResumeTemplate.jsx'
import React from 'react';

const ResumeTemplate = ({ resume }) => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>{resume.name}</h1>
      <h2>{resume.title}</h2>
      <p>{resume.email} | {resume.phone} | {resume.location}</p>

      <h3>Summary</h3>
      <p>{resume.summary}</p>

      <h3>Experience</h3>
      {resume.experience.map((exp, index) => (
        <div key={index}>
          <h4>{exp.position} at {exp.company}</h4>
          <p>{exp.duration}</p>
          <p>{exp.description}</p>
        </div>
      ))}

      {/* Add sections for Skills, Education, Projects */}
      {/* ... */}
    </div>
  );
};

export default ResumeTemplate;