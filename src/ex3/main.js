import '../style.css';
import { renderApp } from '../reactive-engine.js';
import { DataFeed } from './data-feed.js';

const fetchFeed = async () => [
  { id: 1, title: 'Review PR' },
  { id: 2, title: 'Verify AST' },
  { id: 3, title: 'Build the virtual DOM renderer' },
  { id: 4, title: 'Test event delegation' },
  { id: 5, title: 'Review state transitions' },
  { id: 6, title: 'Document loading and retry behavior' },
];

renderApp(
  () => DataFeed({ fetchFeed }),
  document.getElementById('app'),
);
