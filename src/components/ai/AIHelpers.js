import { Zap, Bug, Gauge, Repeat, BookOpen, Layers } from 'lucide-react';

export const AI_PERSONAS = [
  {
    id: 'Nova',
    name: 'Nova',
    role: 'General Helper',
    description: 'Friendly coding companion for all questions.',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20'
  },
  {
    id: 'Astra',
    name: 'Astra',
    role: 'Debugger',
    description: 'Finds bugs and security flaws instantly.',
    icon: Bug,
    color: 'text-red-400',
    bg: 'bg-red-400/10',
    border: 'border-red-400/20'
  },
  {
    id: 'Zen',
    name: 'Zen',
    role: 'Optimizer',
    description: 'Performance tuning and clean code.',
    icon: Gauge,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20'
  },
  {
    id: 'Echo',
    name: 'Echo',
    role: 'Refactorer',
    description: 'Modernizes and simplifies existing code.',
    icon: Repeat,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20'
  },
  {
    id: 'Lumen',
    name: 'Lumen',
    role: 'Documenter',
    description: 'Writes docs and explains complex logic.',
    icon: BookOpen,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20'
  },
  {
    id: 'Atlas',
    name: 'Atlas',
    role: 'Architect',
    description: 'High-level system design and structure.',
    icon: Layers,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10',
    border: 'border-orange-400/20'
  }
];
