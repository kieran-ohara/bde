# Feature Specification: 007 Stag Do Website

**Feature Branch**: `001-007-stag-website`

**Created**: 2026-05-14

**Status**: Draft

**Input**: User description: "007-themed prank website for a friend's stag do. Full-screen background image with a YouTube video that fades in after a delay. Client-side app with TanStack Router. Routes structured as /day-one, /day-two, etc."

## Clarifications

### Session 2026-05-14

- Q: Is `gh-compressed.pdf` a real PDF or a mislabelled image file? → A: Real PDF — extract and convert the image to a web format (JPEG/WebP)
- Q: Should the YouTube video autoplay when the container fades in? → A: No — show the player ready, user clicks play
- Q: What should happen on invalid/unconfigured routes? → A: Redirect to `/day-one`
- Q: How should day-route → YouTube video URL mappings be stored? → A: Hardcoded TypeScript object/map in a config source file
- Q: What should happen when an embedded YouTube video is unavailable or fails to load? → A: Do nothing — let YouTube's iframe show its native "Video unavailable" message
- Q: Which web image format should the converted background image use? → A: Single WebP file
- Q: What YouTube player parameters should the embedded iframe use? → A: Default controls visible, sound on (no extra params beyond the video ID)
- Q: What is the expected behaviour on mobile viewports? → A: Same layout — centred video over full-viewport background, container scales responsively

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Stag Do Page (Priority: P1)

A stag do attendee receives a link (e.g., `/day-one`) and opens it in their browser. The page loads with a full-screen 007-themed background image. After approximately 5 seconds, a video player container smoothly fades into view in the centre of the page, showing an embedded YouTube video ready to play.

**Why this priority**: This is the entire core experience. Without the background image and delayed video reveal, there is no website.

**Independent Test**: Open any day route in a browser, confirm the background image displays immediately, and after ~5 seconds the YouTube video container fades in and is playable.

**Acceptance Scenarios**:

1. **Given** a user navigates to a valid day route (e.g., `/day-one`), **When** the page loads, **Then** a full-screen background image is displayed immediately
2. **Given** the background image has loaded, **When** approximately 5 seconds have elapsed, **Then** a video container fades in smoothly over the centre of the page
3. **Given** the video container is visible, **When** the user clicks play, **Then** the embedded YouTube video plays (no autoplay)

---

### User Story 2 - Navigate Between Days (Priority: P2)

The organiser shares different day-specific links with the group. Each route (e.g., `/day-one`, `/day-two`) loads a page with the same background image and layout but can feature a different YouTube video per day.

**Why this priority**: Multiple days extend the prank across the stag weekend, but the site works fine with just one day.

**Independent Test**: Navigate to two different day routes and confirm each loads correctly with its respective video content.

**Acceptance Scenarios**:

1. **Given** a user navigates to `/day-one`, **When** the page loads, **Then** the day-one specific YouTube video is displayed
2. **Given** a user navigates to `/day-two`, **When** the page loads, **Then** the day-two specific YouTube video is displayed
3. **Given** a user navigates to a day route that has not been configured, **When** the page loads, **Then** the user is redirected to `/day-one`

---

### Edge Cases

- When a user navigates to an invalid route (e.g., `/day-ninety-nine` or `/foo`), they are redirected to `/day-one`
- On mobile viewports the same layout is used (centred video container over viewport-filling background); the video container scales responsively to fit the smaller screen with no separate mobile design or breakpoint-specific repositioning
- If a YouTube video is unavailable or removed, the embedded iframe shows YouTube's native "Video unavailable" message inside the container (no custom error UI, no redirect)
- What happens if the background image fails to load?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The site MUST display a full-screen background image, sourced from the `gh-compressed.pdf` asset extracted and converted to a single optimised WebP file, that covers the entire viewport
- **FR-002**: The site MUST embed a YouTube video in a container centred on the page using YouTube's standard iframe embed with default controls visible and sound on (no autoplay, no mute, no custom player params beyond the video ID)
- **FR-003**: The video container MUST be hidden on initial page load and fade in after approximately 5 seconds
- **FR-004**: The site MUST support named day routes using a `/day-{name}` URL pattern (e.g., `/day-one`, `/day-two`)
- **FR-005**: Each day route MUST be able to display a different YouTube video
- **FR-005a**: Day-route → YouTube video URL mappings MUST be defined in a hardcoded, typed TypeScript configuration object/map within a source file (no runtime fetch, JSON import, or environment variables)
- **FR-005b**: When an embedded YouTube video is unavailable or removed, the application MUST NOT render custom error UI; YouTube's native iframe "Video unavailable" message is the expected behaviour
- **FR-006**: The site MUST be a client-side single-page application (no server-side rendering required)
- **FR-007**: The site MUST use TanStack Router for client-side routing
- **FR-008**: Invalid routes (unconfigured day names, e.g. `/day-foo`, and any other non-day URL, e.g. `/about`) MUST redirect to `/day-one`
- **FR-009**: The background image MUST scale to fill the viewport on all screen sizes without distortion
- **FR-010**: The mobile experience MUST use the same single layout as desktop (centred video container over viewport-filling background); the video container MUST scale responsively (e.g., fluid max-width with 16:9 aspect ratio) so it remains playable on small screens — no separate mobile-only layout, breakpoint-specific repositioning, or "desktop only" gating

### Key Entities

- **Day Page**: Represents a single day of the stag do. Key attributes: day identifier (e.g., "one", "two"), YouTube video URL
- **Video Reveal**: The timed animation sequence - delay duration (~5 seconds), fade-in effect

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Background image is visible within 2 seconds of page load on a standard broadband connection
- **SC-002**: Video container becomes visible approximately 5 seconds after page load (timer starts on component mount, not anchored to image-load events)
- **SC-003**: The fade-in animation completes smoothly without jank or flicker
- **SC-004**: All configured day routes load successfully and display the correct video
- **SC-005**: The site is usable on both desktop and mobile browsers using a single shared layout (no mobile-only fallback or block screen)

## Assumptions

- The background image asset (`gh-compressed.pdf`) will be provided by the user and converted/optimised for web use as a single WebP file (no JPEG fallback or `<picture>` source set needed)
- YouTube videos will be embedded via standard iframe embed (no custom player required)
- The number of days is small and fixed (likely 2-5 days for a stag weekend) - video URLs are hardcoded in a typed TypeScript config map
- No authentication or access control is needed - anyone with the link can view the page
- No analytics or tracking is required
- The site is temporary/disposable - built for a single event
- Hosting will be static (e.g., Vercel, Netlify, GitHub Pages)
