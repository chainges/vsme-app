**GitHub Copilot:** Below is a sample plan transforming the epic into a set of user stories that the SM can later detail out:

1. Story: Install & Configure Clerk  
   - As a developer, I need to install the @clerk/nextjs package and update environment variables so that Clerk is available for authentication.

2. Story: Update Root Layout  
   - As a developer, I need to replace the existing AuthProvider with ClerkProvider in the root layout so that all pages receive Clerk-based context.

3. Story: Revise Authentication Hook  
   - As a developer, I need to update the custom authentication hook to integrate Clerk’s authentication methods for user extraction.

4. Story: Update UI Components  
   - As a user, I want to interact with sign-in and sign-out buttons that use Clerk’s SignInButton, SignOutButton, or UserButton so that I have a seamless authentication experience.
   - As a developer, I need to replace any mock authentication components with those utilizing Clerk.

5. Story: Secure Route Middleware  
   - As a developer, I need to create or update a middleware that leverages Clerk’s authMiddleware to restrict access to protected routes, ensuring that only authenticated users can visit specific pages.

6. Story: Create Dedicated Auth Pages  
   - As a user, I need dedicated sign-in and sign-up pages using Clerk components so that my authentication experience is clear and consistent.
