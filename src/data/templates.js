
// src/components/data/templates.js
// import TEMPLATES_RAW from '../../../shared/templates.json';
import TEMPLATES_RAW from './templates.json';
export const TEMPLATES = TEMPLATES_RAW;

// Helper functions
export const getTemplateById = (id) => {
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
};

export const getTemplatesByCategory = (category) => {
  return TEMPLATES.filter(t => t.category === category);
};

// Get all template categories
export const getTemplateCategories = () => {
  const categories = new Set(TEMPLATES.map(t => t.category));
  return Array.from(categories);
};

// Check if user has access to template
export const canUserAccessTemplate = (template, userSubscription) => {
  if (template.category === 'free') return true;
  if (template.category === 'premium' && userSubscription !== 'free') return true;
  if (template.category === 'vip' && userSubscription === 'vip') return true;
  return false;
};

// Get available templates for user
export const getAvailableTemplates = (userSubscription = 'free') => {
  return TEMPLATES.filter(template => canUserAccessTemplate(template, userSubscription));
};