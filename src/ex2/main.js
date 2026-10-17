import './style.css';
import { renderApp } from '../reactive-engine.js';
import { TaskApp } from './task-app.js';

renderApp(TaskApp, document.getElementById('app'));
