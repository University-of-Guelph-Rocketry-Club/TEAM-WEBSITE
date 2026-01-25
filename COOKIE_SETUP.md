# Cookie & Analytics Setup Guide

## What's Been Added

✅ **Cookie Consent Banner** - Professional banner with Accept/Reject/Customize options
✅ **Google Analytics** - Full integration with consent management
✅ **Privacy Policy Updated** - Comprehensive cookies section
✅ **Three Cookie Types**:
- Necessary (always on)
- Analytics (optional - Google Analytics)
- Functional (optional - preferences, chat history)

## Setup Instructions

### 1. Get Google Analytics ID (Optional but Recommended)

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create an account or sign in
3. Create a new property for your website
4. Get your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Add to Environment Variables

**Frontend (.env):**
```bash
# Add this line to frontend/.env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace `G-XXXXXXXXXX` with your actual Measurement ID.

### 3. Deploy

The cookie banner will automatically appear when users first visit your site.

## How It Works

**First Visit:**
- Cookie banner appears after 1 second
- Users can Accept All, Reject All, or Customize
- Choice is saved in localStorage

**User Choices:**
- **Accept All** - Enables analytics + functional cookies
- **Reject All** - Only necessary cookies (website still works)
- **Customize** - Choose which optional cookies to allow

**Google Analytics:**
- Only activates if user consents
- Anonymizes IP addresses
- Tracks: page views, visitor numbers, popular content
- Respects user privacy choices

## Testing

**Test Cookie Banner:**
1. Clear localStorage: `localStorage.clear()`
2. Refresh page
3. Banner should appear

**Test Analytics:**
1. Accept cookies
2. Check browser console for gtag calls
3. Visit Google Analytics dashboard (data appears in 24-48 hours)

**Test Privacy Policy:**
- Visit `/privacy` to see full policy
- Cookies section explains everything

## Chatbot Knowledge

The AI chatbot now knows about:
- What cookies we use
- How to manage cookie preferences  
- Privacy policy details
- Cookie types and purposes

Try asking: "What cookies do you use?" or "How do I manage cookies?"

## Without Google Analytics

If you don't add a GA Measurement ID:
- Cookie banner still works
- Analytics option does nothing
- Everything else functions normally
- Users can still customize preferences

## Notes

- **Necessary cookies** cannot be disabled (required for website)
- **Consent is saved** for future visits
- **Fully GDPR compliant** with explicit consent
- **Works offline** - no external dependencies except Google Analytics
