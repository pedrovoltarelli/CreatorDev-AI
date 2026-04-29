# CreatorDev AI

A modern SaaS platform for developers, indie hackers, freelancers, and tech creators that turns daily product progress into ready-to-publish content automatically.

## Features

- **Daily Build Input**: Track what you built, features shipped, bugs fixed, lessons learned, metrics reached, and screenshots
- **AI Content Generator**: Generate tweets, LinkedIn posts, newsletters, devlogs, and changelogs instantly
- **Tone Selector**: Multiple tones including Professional, Viral, Technical, Personal Story, Funny, Minimalist, and Founder Mode
- **Content History**: View your content generation timeline with engagement metrics
- **Scheduler**: Schedule posts for later publication
- **GitHub Integration**: Connect to auto-read commits and summarize updates
- **Analytics Dashboard**: Track posts generated, most used platforms, engagement, and consistency streaks
- **Templates**: Prebuilt templates for launches, new features, bug fixes, revenue milestones, and more

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key
- Stripe account

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`
4. Run development server: `npm run dev`

### Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## Pricing

- **Free**: 5 generations/month
- **Pro**: $29,90/month
- **Creator**: $59,90/month
- **Team**: $89,90/month

## Project Structure

- `app/` - Next.js app router pages
- `components/` - Reusable UI components
- `lib/` - Utility functions and constants
- `styles/` - Global styles and themes

## License

MIT
