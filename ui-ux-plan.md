# GramSeva UI/UX Plan Document

## 1. Project Overview

**Project Name:** GramSeva - Digital Bangladesh for Rural Areas

**Purpose:** A digital platform connecting rural populations with local service providers (electricians, plumbers, doctors, tutors, mechanics, drivers), enabling issue reporting, market price tracking, weather updates, and service bookings.

**Target Users:**
- **General Users (Rural Population):** Access local services, report community issues, check market prices, view weather updates
- **Service Providers:** Manage their services, receive and manage bookings, grow their customer base
- **Admins:** Manage users, services, reports, markets, and platform analytics

**Tech Stack:**
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Lucide React Icons

---

## 2. Current Page Analysis & Improvements

### 2.1 Public Pages

#### Home (/)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Well-structured landing page with clear CTAs |
| Hero Section | Good | Good gradient background, voice search prompt |
| Categories | Good | Grid layout with icons, smooth hover effects |
| Stats Section | Needs Improvement | Static values, should fetch real-time data |
| Features Section | Good | Card layout with icons |
| CTA Section | Good | Registration prompt |
| Issues | None | Could add quick action buttons |

**Proposed Changes:**
- Add dynamic stats fetching from API
- Add hero animation on load
- Add quick action floating button for mobile

---

#### Services (/services)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Clean list with cards |
| Filter | Good | Category filter with icons |
| Search | Good | Search functionality |
| Empty State | Good | Emoji + message |
| Service Cards | Good | Provider info, rating, price |
| Loading | Needs Improvement | Replace Loader with skeleton |
| Issues | - No sort options | Add price/rating sort |

**Proposed Changes:**
- Add loading skeleton instead of spinner
- Add "Sort by" dropdown (price, rating, distance)
- Show distance if location available
- Add "Verified" badge emphasis

---

#### Service Detail (/services/[id])

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Comprehensive detail page |
| Header | Good | Provider info with gradient |
| Rating Display | Good | Star rating with count |
| Pricing | Good | Clear hourly rate |
| Description | Good | Service description |
| Provider Info | Good | Location, phone, verification |
| Reviews | Needs Improvement | No pagination, basic styling |
| Booking Modal | Good | Functional booking form |
| Issues | - No social share | Add share functionality |

**Proposed Changes:**
- Add pagination for reviews (load more)
- Add share button
- Add "Similar Services" section
- Add provider response to reviews section

---

#### New Service (/services/new)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Needs Improvement** | Basic form, limited validation |
| Form Fields | Good | Category, description, rate, availability |
| Validation | Needs Improvement | Client-side only |
| Preview | None | Add service preview before submit |
| Issues | - No image upload | Add service photos |

**Proposed Changes:**
- Add image upload for service
- Add working hours specification
- Add service area (village/ward)
- Add preview before submit
- Add draft save functionality

---

#### Reports (/reports)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Clean list with status badges |
| Filters | Good | Status filter tabs |
| Report Cards | Good | Problem type, location, votes |
| Empty State | Good | Clear message |
| Voting | Good | Vote functionality |
| Loading | Needs Improvement | Add skeleton |
| Issues | - No map view | Add optional map view |

**Proposed Changes:**
- Add loading skeleton
- Add "My Reports" filter for logged-in users
- Add map view toggle
- Add filter by problem type
- Add sort by votes/date

---

#### New Report (/reports/new)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Voice-enabled form |
| Voice Input | Good | VoiceButton integration |
| Form Fields | Good | Problem type, description, location |
| Issues | - No photo upload | Add photo evidence upload |
| - No anonymous option | Allow anonymous reporting |

**Proposed Changes:**
- Add photo upload (up to 3 images)
- Add anonymous reporting toggle
- Add urgency level selection
- Add location picker with map

---

#### Market (/market)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Comprehensive market info |
| Today's Haat | Good | Highlights today's markets |
| Filters | Good | Day and product filters |
| Market List | Good | Cards with details |
| Price Table | Good | Comprehensive price list |
| Admin Panel | Bad | Placeholder buttons, no functionality |
| Issues | - No price trends | Add price history/chart |

**Proposed Changes:**
- Implement admin market management modals
- Add price trend charts (last 7 days)
- Add "Price Alert" feature
- Add "My Village" quick filter

---

#### Weather (/weather)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Comprehensive weather data |
| WeatherCard | Good | Current weather display |
| Agri Tips | Good | Crop season advice |
| Details Grid | Good | Temperature, humidity, wind, rain |
| Location Input | Needs Improvement | Manual lat/lng input |
| Issues | - No auto-location | Add geolocation API |
| - No forecast details | Expand daily forecast |

**Proposed Changes:**
- Add "Use My Location" button with geolocation
- Save last viewed location
- Expand daily forecast (7 days)
- Add weather alerts/notifications
- Add "Planting Guide" based on season

---

#### Bookings (/bookings)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Clean booking list |
| Empty State | Good | Clear message with CTA |
| Booking Cards | Good | Service, date, status |
| Status Badges | Good | Color-coded statuses |
| Loading | Needs Improvement | Add skeleton |
| Issues | - No calendar view | Add calendar view toggle |

**Proposed Changes:**
- Add loading skeleton
- Add calendar view
- Add filter by status
- Add booking details expansion

---

#### Feedback (/feedback)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Voice + text feedback |
| Text/Voice Toggle | Good | Clear toggle buttons |
| Voice Recording | Good | VoiceFeedback component |
| Star Rating | Good | 5-star rating |
| My Feedback List | Good | History display |
| Issues | - No admin reply | Add admin response feature |

**Proposed Changes:**
- Add admin reply/response
- Add feedback status tracking
- Add "Helpful" vote for feedback
- Add filter by rating

---

#### Profile (/profile)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Redirects to role-specific page |
| Loading State | Good | Spinner during redirect |
| Issues | None | Well implemented |

**Proposed Changes:**
- None needed - properly redirects based on role

---

#### Login (/login)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Clean two-step login |
| Phone Input | Good | Phone number field |
| OTP Input | Good | 6-digit OTP |
| Error Handling | Good | Error display |
| Loading States | Good | Loading indicators |
| Issues | - No remember me | Add remember me checkbox |

**Proposed Changes:**
- Add "Remember this device" option
- Add resend OTP countdown
- Add biometric login option (fingerprint)

---

#### Register (/register)

| Aspect | Status | Details |
|--------|---------|---------|
| Overall | **Good** | Comprehensive registration |
| Form Fields | Good | Name, phone, village, role |
| Role Selection | Good | User/Provider toggle |
| OTP Verification | Good | Phone verification |
| Issues | - No terms acceptance | Add terms checkbox |

**Proposed Changes:**
- Add terms and conditions checkbox
- Add profile photo upload
- Add provider-specific fields based on role

---

### 2.2 Role-Specific Pages

#### User Dashboard (/user/dashboard)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Comprehensive user dashboard |
| Welcome Header | Good | User name display |
| Stats Cards | Good | Reports, bookings, votes |
| Quick Links | Good | Grid of action buttons |
| Recent Activities | Good | Activity list |
| Empty States | Good | Clear messages |
| Issues | - No charts | Add visual charts |

**Proposed Changes:**
- Add chart for report statistics
- Add notification center
- Add "My Favorite Providers" section
- Add upcoming bookings widget

---

#### Provider Dashboard (/provider/dashboard)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Comprehensive provider dashboard |
| Welcome Header | Good | Provider type display |
| Stats Cards | Good | Services, bookings, earnings |
| Rating Section | Good | Average rating display |
| Recent Bookings | Good | Booking list with actions |
| Status Actions | Good | Confirm/complete/cancel buttons |
| Issues | - No earnings chart | Add earnings chart |

**Proposed Changes:**
- Add earnings trend chart
- Add "Busy Hours" analytics
- Add customer feedback summary
- Add availability toggle (quick)

---

#### Provider Profile (/provider/profile)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Needs Improvement** | Basic profile view |
| Edit Functionality | Needs Improvement | Not implemented |
| Issues | - No edit mode | Add inline editing |

**Proposed Changes:**
- Add edit profile functionality
- Add service portfolio section
- Add certifications/verification badges
- Add working hours configuration

---

#### Admin Dashboard (/admin/dashboard)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Good** | Comprehensive admin overview |
| Stats Grid | Good | 6 key metrics |
| Report Stats | Good | Status breakdown |
| Quick Actions | Good | Management links |
| Recent Activities | Good | Activity feed |
| Issues | - No charts | Add trend charts |

**Proposed Changes:**
- Add system health indicators
- Add quick analytics charts
- Add notification of pending actions

---

#### Admin Users (/admin/users)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Needs Improvement** | Basic list |
| Search/Filter | Needs Implementation | Not implemented |
| User Actions | Needs Implementation | Not implemented |
| Issues | - Full CRUD missing | Implement user management |

**Proposed Changes:**
- Add search by name/phone
- Add filter by role/status
- Add user edit/delete actions
- Add verification toggle
- Add pagination

---

#### Admin Services (/admin/services)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Needs Improvement** | Basic list |
| Management | Needs Implementation | Not implemented |
| Issues | - Full CRUD missing | Implement service management |

**Proposed Changes:**
- Add service approval workflow
- Add service edit/delete
- Add category management
- Add featured services toggle

---

#### Admin Reports (/admin/reports)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Needs Improvement** | Basic list |
| Status Update | Needs Implementation | Not implemented |
| Issues | - Status management missing | Implement report management |

**Proposed Changes:**
- Add status update functionality
- Add admin notes/comments
- Add assignment to workers
- Add resolution details

---

#### Admin Markets (/admin/markets)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Bad** | Non-functional admin panel |
| CRUD Operations | Bad | Not implemented |
| Issues | - Must implement | Full market CRUD needed |

**Proposed Changes:**
- Add "Add New Haat" modal
- Add "Update Price" modal
- Add market enable/disable
- Add price history management

---

#### Admin Feedback (/admin/feedback)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Needs Improvement** | Basic view |
| Response | Needs Implementation | Not implemented |
| Issues | - No admin response | Add reply functionality |

**Proposed Changes:**
- Add admin response/reply
- Add feedback categorization
- Add priority flags
- Add export functionality

---

#### Admin Profile (/admin/profile)

| Aspect | Status | Details |
|--------|--------|---------|
| Overall | **Needs Improvement** | Basic view |
| Edit | Needs Implementation | Not implemented |
| Issues | - No edit mode | Add profile editing |

**Proposed Changes:**
- Add profile editing
- Add admin settings
- Add system configuration access

---

## 3. UI/UX Guidelines

### 3.1 Color Scheme

| Color Role | Value | Usage |
|------------|-------|-------|
| Primary | `#8B5A2B` (Brown) | Main brand, buttons, headers |
| Primary Dark | `#5D3A1A` | Hover states, accents |
| Primary Light | `#A87B4A` | Subtle highlights |
| Secondary | `#2E7D32` (Green) | Success, agriculture, eco |
| Secondary Dark | `#1B5E20` | Hover states |
| Secondary Light | `#4CAF50` | Success indicators |
| Accent | `#FFA726` (Orange) | CTAs, highlights, important |
| Accent Dark | `#F57C00` | Hover states |
| Success | `#4CAF50` | Positive states |
| Warning | `#FFC107` | Caution states |
| Error | `#F44336` | Error states |
| Info | `#2196F3` | Information |

**Usage Guidelines:**
- Use primary for main actions (Submit, Book, Save)
- Use secondary for success states and eco/agriculture features
- Use accent for important CTAs and notifications
- Use semantic colors consistently (green=success, red=error, yellow=warning)

### 3.2 Typography

**Primary Font:** Hind Siliguri (for Bengali content)

**Font Stack:**
```css
font-family: 'Hind Siliguri', 'SolaimanLipi', 'Nikosh', sans-serif;
```

**Font Sizes:**
| Element | Size | Line Height |
|---------|------|-------------|
| H1 | 2rem (32px) | 1.2 |
| H2 | 1.5rem (24px) | 1.3 |
| H3 | 1.25rem (20px) | 1.4 |
| Body | 1rem (16px) | 1.5 |
| Small | 0.875rem (14px) | 1.5 |
| XSmall | 0.75rem (12px) | 1.4 |

**Weight:**
- Bold: 700 (titles)
- Semibold: 600 (headings)
- Medium: 500 (labels)
- Regular: 400 (body)

### 3.3 Spacing & Layout

**Spacing Scale (Tailwind):**
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 1rem (16px)
- lg: 1.5rem (24px)
- xl: 2rem (32px)
- 2xl: 3rem (48px)

**Layout Max Width:**
- Container: max-w-7xl (1280px)
- Cards: max-w-4xl (896px)
- Forms: max-w-md (448px)

**Border Radius:**
- sm: 4px (buttons)
- DEFAULT: 8px (inputs)
- lg: 12px (cards)
- xl: 16px (modals)
- 2xl: 24px (sections)

**Shadows:**
- card: `0 2px 8px rgba(0,0,0,0.08)`
- card-hover: `0 8px 24px rgba(0,0,0,0.12)`
- nav: `0 -2px 10px rgba(0,0,0,0.1)`

### 3.4 Icons & Illustrations

**Icon Library:** Lucide React

**Icon Usage:**
- 16px: Inline text icons
- 20px: Navigation, buttons
- 24px: Section headers
- 32px: Large displays
- 48px: Empty states

**Illustration Guidelines:**
- Use emoji for empty states (lightweight)
- Keep illustrations culturally appropriate for rural Bangladesh
- Use Bengali script for placeholders when possible

---

## 4. Feature Enhancements

### 4.1 Empty States for All Lists

**Current Status:** Implemented on some pages
**Target:** All list pages

**Standard Empty State Template:**
```jsx
<div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
  <IconClassName className="w-16 h-16 mx-auto mb-4 text-gray-400" />
  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
    [Context-specific title]
  </h3>
  <p className="text-gray-500 dark:text-gray-400 mt-2">
    [Context-specific message]
  </p>
  [Optional CTA Button]
</div>
```

**Pages needing empty state:**
- [ ] Services list
- [ ] Reports list
- [ ] Bookings list
- [ ] Market prices
- [ ] User dashboard activities
- [ ] Provider dashboard bookings
- [ ] Admin: Users, Services, Reports, Markets

### 4.2 Loading Skeletons

**Create reusable Skeleton Components:**
- `SkeletonCard` - for list items
- `SkeletonTable` - for table rows
- `SkeletonText` - for text paragraphs
- `SkeletonAvatar` - for user images

**Implementation:**
```jsx
// Example skeleton for service card
<div className="animate-pulse">
  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
</div>
```

**Pages needing skeleton:**
- [ ] Services list (replace Loader)
- [ ] Reports list
- [ ] Market page
- [ ] All dashboard pages
- [ ] Profile pages

### 4.3 Toast Notifications

**Current Status:** Implemented (ToastContext, Toast, ToastContainer)

**Enhancements Needed:**
- Add toast types: success, error, warning, info
- Add position: top-right, bottom-center
- Add auto-dismiss with configurable duration
- Add action button in toast

**Usage:**
```tsx
import { useToast } from '@/contexts/ToastContext';

const { showToast } = useToast();
showToast('Service booked successfully!', 'success');
```

### 4.4 Search & Filter Improvements

**Unified Search Component:**
- Add debounced search (300ms)
- Add search suggestions
- Add voice search integration
- Add recent searches history

**Filter Component:**
- Add multi-select capability
- Add "Clear all filters" button
- Add active filter count badge
- Add save filter preset

**Pages to enhance:**
- [ ] Services (/services)
- [ ] Reports (/reports)
- [ ] Market (/market)
- [ ] Admin pages

### 4.5 Mobile Responsiveness

**Current Status:** Good (mobile-first, bottom nav)

**Enhancements Needed:**
- Add touch-friendly tap targets (min 44px)
- Add swipe gestures for navigation
- Add pull-to-refresh
- Optimize images for mobile data
- Add offline mode indicator

**Responsive Breakpoints:**
- Mobile: < 640px (default)
- Tablet: 640px - 1024px (sm:)
- Desktop: > 1024px (lg:)

---

## 5. Accessibility

### 5.1 Voice Features (Already Implemented)

**Current Implementation:**
- `VoiceButton` - Voice input for search
- `VoiceSearch` - Full voice search component
- `GlobalReadPageButton` - Read entire page content
- `SpeakButton` - Read specific content
- `TextToSpeech` - Text to speech utility

**Enhancements:**
- Add voice commands for navigation
- Add voice feedback confirmation
- Optimize speech synthesis for Bengali

### 5.2 Text-to-Speech (Already Implemented)

**Components:**
- `ReadPageContent` - Reads page content
- `SpeakButton` - Manual speech trigger

**Enhancements:**
- Add TTS speed control
- Add voice selection (male/female)
- Add pause/resume functionality

### 5.3 Offline Indicators

**Current Implementation:**
- `useOfflineReport` - Offline report handling

**Enhancements Needed:**
- Add offline status banner
- Add "Offline Mode" indicator in header
- Add sync status for pending data
- Add cached data indicator
- Add PWA install prompt

**Offline Features to Add:**
- [ ] Offline service list (cache)
- [ ] Offline reports queue
- [ ] Background sync when online
- [ ] Offline maps/locations

---

## 6. Implementation Priority

### Phase 1: Critical Fixes (Week 1-2)

| Priority | Task | Page |
|----------|------|------|
| 1 | Add skeleton loaders | All data-fetching pages |
| 2 | Fix admin markets CRUD | /admin/markets |
| 3 | Implement admin users management | /admin/users |
| 4 | Add empty states everywhere | All list pages |
| 5 | Fix admin services management | /admin/services |

### Phase 2: UI Enhancements (Week 3-4)

| Priority | Task | Page |
|----------|------|------|
| 1 | Add sort/filter controls | Services, Reports |
| 2 | Add charts to dashboards | User, Provider, Admin |
| 3 | Mobile optimizations | All pages |
| 4 | Improve form validations | All forms |
| 5 | Add image upload support | Service creation, Reports |

### Phase 3: Polish (Week 5-6)

| Priority | Task | Page |
|----------|------|------|
| 1 | Offline mode improvements | All |
| 2 | Toast notification enhancements | All |
| 3 | Voice command expansion | Navigation |
| 4 | Animation polish | Transitions |
| 5 | Performance optimization | Bundle size, lazy loading |

---

## 7. Additional Recommendations

### 7.1 Performance
- Add image optimization (next/image)
- Implement lazy loading for heavy components
- Add pagination for all list endpoints
- Cache frequently accessed data

### 7.2 Security
- Add input sanitization
- Implement rate limiting
- Add CSRF protection
- Secure API endpoints

### 7.3 Analytics
- Add user行为 tracking
- Track popular services
- Monitor report resolution time
- User engagement metrics

### 7.4 Future Features
- Push notifications
- In-app messaging
- Service ratings/comments
- Provider verification system
- Emergency services quick access
- Government scheme information
- Agricultural marketplace

---

**Document Version:** 1.0
**Created:** April 2026
**Last Updated:** April 2026
