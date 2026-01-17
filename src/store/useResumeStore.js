// src/store/useResumeStore.js
import { create } from 'zustand';

const initialResume = {
  personal: {
    name: 'Rajkumar Chourasiya',
    title: 'Full Stack Developer',
    email: 'rajkumar@example.com',
    phone: '+91 98765 43210',
    location: 'Indore, MP',
    summary: 'Passionate MERN & Android developer with 1+ year of experience in building scalable web apps and API integrations. Loves chai, competitive coding, and open-source contributions.'
  },
  experience: [
    {
      role: 'Software Developer',
      company: 'TechStart Solutions',
      duration: 'Jun 2024 – Present',
      description: 'Built REST APIs with Node.js & Java. Integrated React frontends with MongoDB. Optimized query performance by 40%.'
    }
  ],
  education: [
    {
      degree: 'B.Tech in Computer Science',
      institute: 'Devi Ahilya Vishwavidyalaya',
      year: '2020 – 2024'
    }
  ],
  // ✅ Start with strings (simple) — we’ll support both
  skills: ['React', 'Node.js', 'Java', 'Android', 'MongoDB', 'API Integration'],
  projects: [
    {
      name: 'Resume Maker (This App!)',
      tech: 'React, Zustand, CSS Modules',
      desc: 'A premium, Canva-like resume builder with drag-and-drop editing and PDF export.'
    }
  ],
  theme: { primary: '#2563eb' }
};

export const useResumeStore = create((set) => ({
  resume: initialResume,

  // ✅ FIXED: supports both dot paths AND array bracket paths like 'skills[0]'
  updateField: (path, value) => {
    set((state) => {
      // Handle simple string paths: 'personal.name'
      if (!path.includes('[')) {
        const keys = path.split('.');
        let obj = { ...state.resume };
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
          current = current[keys[i]] = Array.isArray(current[keys[i]])
            ? [...current[keys[i]]]
            : { ...current[keys[i]] };
        }
        current[keys[keys.length - 1]] = value;
        return { resume: obj };
      }

      // Handle array paths: 'skills[2]', 'experience[0].role'
      const match = path.match(/^(\w+)(\[)(\d+)(\])(\.(\w+))?$/);
      if (!match) {
        console.warn('Unsupported path format:', path);
        return state;
      }

      const [, arrayName, , indexStr, , prop] = match;
      const index = parseInt(indexStr, 10);

      const newArray = [...(state.resume[arrayName] || [])];

      if (prop) {
        // e.g., 'skills[0].name' → update object property
        newArray[index] = {
          ...newArray[index],
          [prop]: value
        };
      } else {
        // e.g., 'skills[3]' → replace entire item
        newArray[index] = value;
      }

      return {
        resume: {
          ...state.resume,
          [arrayName]: newArray
        }
      };
    });
  },

  setTheme: (theme) =>
    set((state) => ({
      resume: { ...state.resume, theme: { ...state.resume.theme, ...theme } }
    }))
}));