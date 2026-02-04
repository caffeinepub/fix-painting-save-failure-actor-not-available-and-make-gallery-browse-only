# Specification

## Summary
**Goal:** Fix the painting save failure caused by the backend actor not being ready, and make the Gallery a browse-only experience (including a non-navigating empty state).

**Planned changes:**
- Gate the Draw page “Complete”/save action behind backend actor initialization: show a loading state and keep the action disabled until the actor is ready.
- If actor initialization fails, show a clear English error message indicating saving is unavailable and keep saving disabled until the user recovers (e.g., refresh/relogin), avoiding the client error string “Actor not available”.
- Update Gallery empty-state UI to be read-only browsing: remove any calls-to-action/links that navigate to the Draw page (e.g., remove “Create the First One” style actions) while keeping the dashboard Gallery tile as the entry point for viewing existing paintings.

**User-visible outcome:** Users can only save after the app is ready to save; if initialization fails they see a clear message and cannot attempt saving. The Gallery supports browsing only and no longer prompts users to create a painting when the gallery is empty.
