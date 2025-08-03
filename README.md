# Glitch Engine - Project Backup

## Project Overview
**Glitch Engine** is an async recruiting platform designed for modern agencies. The platform allows agencies to hire top talent without the traditional hassle of scheduling calls and meetings.

### Key Features
- **Async-First Approach**: No meetings, no calls - everything is done asynchronously
- **5-Step Process**: From intake to hire in 5 simple steps
- **Video Interviews**: Candidates submit video responses that can be reviewed on your schedule
- **Smart Filtering**: AI-powered sourcing and screening of 100+ candidates down to top 5
- **Dashboard Interface**: Clean, modern interface to track hiring progress

## Technology Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for smooth interactions
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Font**: Inter (Google Fonts)

## Project Structure
```
src/
├── components/
│   ├── Header.tsx          # Navigation header with logo and menu
│   ├── Hero.tsx            # Landing page hero section with animations
│   ├── Testimonial.tsx     # Customer testimonial section
│   ├── StepByStepFlow.tsx  # Interactive 5-step process explanation
│   ├── WhyAsyncWorks.tsx   # Benefits of async hiring
│   ├── MidPageCTA.tsx      # Call-to-action section
│   ├── FAQ.tsx             # Frequently asked questions
│   ├── Footer.tsx          # Site footer
│   ├── SignUpPage.tsx      # User registration page
│   ├── LoginPage.tsx       # User login page
│   └── Dashboard.tsx       # Main dashboard with hiring progress
├── App.tsx                 # Main app component with routing logic
├── main.tsx               # React app entry point
├── index.css              # Tailwind CSS imports
└── vite-env.d.ts          # Vite type definitions
```

## Design System
The project uses a carefully crafted design system with:

### Colors
- **Primary Violet**: #7B61FF (main brand color)
- **Accent Yellow**: #FFD500 (highlights and CTAs)
- **Background**: White (#FFFFFF) and Beige (#FAF9F6)
- **Text**: Primary (#111111) and Secondary (#555555)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold weights with tight line-height
- **Body**: Regular weight with relaxed line-height

### Components
- **Cards**: 12px border radius with subtle shadows
- **Buttons**: 8px border radius with hover effects
- **Spacing**: 8px grid system for consistent layouts

## Key Components

### Dashboard States
The dashboard shows different states based on user progress:
1. **Not Started**: Intake booking interface
2. **Job Posting**: Progress indicator for job posting
3. **Interviewing**: Live counter of candidates being reviewed
4. **Videos Ready**: Grid of candidate video interviews
5. **Picked**: Success state with upsell options

### Animations
- Framer Motion for page transitions and micro-interactions
- Scroll-triggered animations in StepByStepFlow
- Hover effects and loading states throughout
- Parallax effects in hero section

### Responsive Design
- Mobile-first approach with breakpoints
- Carousel interface for mobile step-by-step flow
- Adaptive layouts for all screen sizes

## Installation & Setup
```bash
npm install
npm run dev
```

## Build for Production
```bash
npm run build
npm run preview
```

## Key Features Implementation

### Async Workflow
- No real-time features required
- All interactions are form-based or video-based
- Dashboard updates show progress without live updates

### User Journey
1. Landing page with clear value proposition
2. Sign up process (email + password)
3. Dashboard showing hiring progress
4. Video review interface for candidate selection
5. Success state with onboarding upsell

### Performance Optimizations
- Lazy loading of components
- Optimized images from Pexels
- Minimal bundle size with tree shaking
- Fast loading with Vite

## Backup Information
- **Created**: $(date)
- **Version**: React 18 + TypeScript + Tailwind
- **Status**: Production-ready MVP
- **Dependencies**: All locked in package.json

## Notes
- Logo file exists at `/public/logo.jpeg`
- All images use Pexels URLs for stock photos
- No backend integration - frontend only
- Ready for deployment to static hosting

This backup contains all source code, configuration files, and documentation needed to restore or recreate the project.