# Event Studio: AI Celebration and Event Management

A mobile-first, AI-powered workspace for planning and running large events such as weddings, galas, and conferences. Built with prompt-driven development in Google AI Studio for PromptWars: Virtual (Google Developers x Hack2Skill).

**Live app:** https://ais-pre-bjacouwsb7f6hcvxnksmnw-45763305380.asia-southeast1.run.app/

## Problem Statement Alignment

Planning a 450-guest event means coordinating venues, guests, budgets, staff, and risk across many tools. Event Studio brings these into one swipeable workspace and uses Gemini to detect conflicts and suggest fixes before they become problems.

- Event setup (type, city, guests, budget, date): Setup screen
- Find suitable venues: Screen 2, Venue Search
- Guests, dietary needs, check-in: Screen 3, Guest Manager
- Budget planning and expenses: Screen 4, Smart Budget
- Crew and duty stations: Screen 5, Staff Ops
- Event controls, sharing, governance: Screen 6, Event Hub
- Natural-language help: Screen 7, AI Concierge
- Risk detection and fixes: AI Conflict Solver cards

## Features

- **Event setup:** type, title, honorees, venue, city, guest count, layout, date, time, tier, budget
- **Venue Search:** venues matched to city, capacity, and budget, with a budget-fit score
- **Guest Manager:** RSVPs, tables, dietary tags, search, filters, door check-in
- **Smart Budget:** category allocation, expense ledger, remaining reserve, cost per guest
- **Staff Ops:** crew roster, shifts, radio channels, duty status
- **Event Hub:** edit setup, share event and QR pass, terms, end event, sign out
- **AI Concierge:** chatbot for questions about the event
- **AI Conflict Solver:** flags egress, allergen, budget, fatigue, queue, and curfew risks, and proposes fixes

## Gen AI Services Used

- **Google AI Studio (Build mode):** generating and iterating on the application through prompts
- **Gemini API:** AI Concierge chatbot and AI Conflict Solver analysis
- **Gemini with Google Search grounding:** Venue Search suggestions (include only if enabled)

## Tech Stack

- Front end: web app generated in Google AI Studio (update with exact framework)
- AI: Gemini API
- Hosting: Google Cloud Run (AI Studio deployment)

## Getting Started

**Use the deployed app**
1. Open the live link in a browser (use incognito if you see a cookie check).
2. Sign in, or use the demo option if available.
3. Fill in the event setup and launch the event hub.
4. Swipe left or right, or use the quick-jump bar, to move between screens.

**Run locally (if you exported the code)**
```bash
npm install
cp .env.example .env.local   # set GEMINI_API_KEY=your_key_here
npm run dev
```

## Code Quality

- Single shared state keeps budget, guest, and staff numbers consistent across screens
- Business logic isolated in small pure functions
- Constants and sample data kept separate from UI code

## Security

- No credentials or API keys in the repository; keys come from environment variables
- User inputs validated and sanitized before use or display
- Authentication through Google Sign-In (update to match your implementation)
- Generic error messages that do not expose internals

## Efficiency

- AI responses cached per input set to avoid repeated calls
- Search and chat inputs debounced
- Images lazy-loaded with a fallback if they fail

## Testing

Unit tests cover:
- Budget totals never go negative and category percentages sum to 100%
- Venues below guest capacity are filtered out
- RSVP percentage is calculated from the full invite count
- Shift health drops when long shifts are scheduled
- Queue time is calculated consistently from guests, gates, and seconds per guest

Run with `npm test`.

## Accessibility

- Readable text size and WCAG AA contrast targets
- ARIA labels, visible focus states, keyboard navigation
- Alt text and fallbacks for images
- Labeled form fields and reduced-motion support

## Known Limitations

- Venue prices and ratings are AI-generated estimates, not live bookings
- Guest data and expenses in the demo are sample data

## Roadmap

- Real-time collaboration for multiple producers
- Exportable run-of-show and guest list
- Booking integrations for venues and vendors
- Multi-day schedule view tied to the setup form

## Credits

Built for PromptWars: Virtual by Google Developers in collaboration with Hack2Skill.

Author: Shubham gurjar, devloper of the app .
