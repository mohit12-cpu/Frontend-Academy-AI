
import { Module } from './types';

export const MODULES: Module[] = [
  {
    id: 'html-basics',
    title: 'HTML Foundations',
    lessons: [
      {
        id: 'html-struct',
        title: 'The Skeleton: HTML Structure',
        description: 'Understand the basic boilerplate of an HTML document.',
        content: 'HTML stands for HyperText Markup Language. It is the backbone of any website. Every document starts with a DOCTYPE and contains head and body tags.',
        codeSnippet: `<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n  </head>\n  <body>\n    <h1>Hello World</h1>\n  </body>\n</html>`,
        difficulty: 'Beginner'
      },
      {
        id: 'html-semantics',
        title: 'Semantic HTML',
        description: 'Why header, footer, and main tags matter.',
        content: 'Semantic elements lead to better SEO and accessibility. Use tags like <article>, <nav>, and <section> instead of generic <div> tags.',
        codeSnippet: `<header>\n  <nav>\n    <ul>\n      <li>Home</li>\n    </ul>\n  </nav>\n</header>`,
        difficulty: 'Beginner'
      }
    ]
  },
  {
    id: 'css-mastery',
    title: 'CSS Styling & Layout',
    lessons: [
      {
        id: 'css-flexbox',
        title: 'Flexbox Fundamentals',
        description: 'Master the art of one-dimensional layouts.',
        content: 'Flexbox allows you to align items in a container even when their size is unknown. Key properties: justify-content, align-items, flex-direction.',
        codeSnippet: `.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`,
        difficulty: 'Intermediate'
      },
      {
        id: 'css-grid',
        title: 'CSS Grid Mastery',
        description: 'Creating 2D layouts with ease.',
        content: 'Grid is the most powerful layout system available in CSS. It works on a grid of rows and columns.',
        codeSnippet: `.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}`,
        difficulty: 'Intermediate'
      }
    ]
  },
  {
    id: 'javascript-logic',
    title: 'JavaScript & Logic',
    lessons: [
      {
        id: 'js-async',
        title: 'Async/Await & Promises',
        description: 'Handling asynchronous operations gracefully.',
        content: 'Asynchronous programming is essential for fetching data or performing long-running tasks without blocking the UI.',
        codeSnippet: `async function fetchData() {\n  const response = await fetch('api/data');\n  const data = await response.json();\n  return data;\n}`,
        difficulty: 'Advanced'
      }
    ]
  }
];
