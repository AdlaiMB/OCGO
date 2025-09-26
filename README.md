# OCGO

## What is OCGO

OCGO is a webapp built with nextjs and neon to facilitate the process of finding new locations in orange county.

## My goal with OCGO

My main goal with developing OCGO was to gain more experience using my computer science knowledge to develop a full stack application. The topics I wanted to lean heavily into were server code, authorization/authentication, and database design. I also wanted to learn more about popular software frameworks and librarys such as nextjs and react to gain more experience in modern web development.

## Tools used

- vercel
- javascript
- nextjs (react)
- neon (postgreSQL)
- nextauth
- argon
- zod

## Implementation Description

Any user regardless of being signed up or signed in can view locations, comments, and profiles. However, only signed in users can create locations and comments. Locations have the ability to be updated by the user that created them, but are not allowed to be deleted. Comments on the other hand are allowed to be updated and deleted as long as the user exists. User profiles like comments can be updated and deleted by the user, but deletion of the profile will result in loss of access to update and or delete the user's locations and comments. Below is the interface flow to better understand what options are available.

### Database design

![ER Diagram for my database](/images/er-diagram.png)

### Webapp flow

![Webapp flow diagram](/images/webapp-flow.png)

### Server Flow

![Server flow diagram](/images/server-flow.png)

## What I learned

### Nextjs

- layouts/multiple root layouts
  - Reading the nextjs docs I learned how layouts are used to create shared structure across pages. I also learned that layouts can be nested if layouts exists between the segements in a route and that layouts preserve state, remain interactive, and do not rerender.
  - I also learned about the abilitiy to create multiple root layouts to partition an application.
- redirect
  - I learned about the redirect function provided by nextjs and used it inside my DAL for authorization.
- data access layer

  > The data access layer is a layer in an application that provides easy and simplified access to data stored in persistent storage (geeksforgeeks)

  - Reading the nextjs docs I came across a section talking about creating a data access layer (DAL) to centralize data request and authorization logic. Before coming across this section I had never once heard of a DAL, however after using a DAL for OCGO I quickly realized their
    usefulness for creating a consitent pattern for data access.

- server only

  > JavaScript modules can be shared between both Server and Client Components modules. This means it's possible to accidentally import server-only code into the client (nextjs)

  - Reading the nextjs docs I came across the topic of environment poisoning. I wasn't aware of the potential of accidently importing server code into the client, which can result in enviornment variables being exposed or bugs (nextjs clears environemnt variables if accidently imported to the client). In the docs they provided a tip to import the server-only package to prevent client modules from importing server code, which is what I used for my DAL.

- middleware

  > Middleware allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers, or responding directly. (nextjs)

  - Previous to this project I was aware of middleware and how it is used but I had never used it for a project. From reading the nextjs docs I learned it can be used to perform authorization for pages. I performed authorization with the use of nextauth and the middleware file to prevent not signed in users from accessing the routes `/create`, `/update`

### React

- server/client components
  - From reading the react docs I learned that server components are components that can run with or without a server and during build time or for each request. They allow for direct access to your data layer inside the component.
  - From reading the react docs I learned that client components are components that support interactivy and state.
- server functions
  - From reading the react docs I learned that server functions are functions defined in the server that can be called from client components. They are defined using the 'use server' directive. I also learned that the 'user server' directive has nothing to do with server components. Server components are not server functions. Another importnact fact I learned from the react docs was that server functions are designed for mutations and are not recommended for data fetching.
- serialization
  - From reading the react docs I also became aware of what data types are allowed to be passed from server components to client components, as well arguments from client components to server functions.
- hooks
  - From reading the react docs to understand server/client components and server functions I came across some react hooks/apis that I wasn't aware of before that were useful for my project. The hooks/apis I used were the useActionState, useOptimistic, and startTransition.

### Authentication/Authorization

- sessions
  - A session is a sequence of network http request and response transactions associated with the same user.
  - I learned about two types of sessions stateless and database. I learned about the tradeoffs and benfits of each.
  - Prior to this project I wasn't familiar with how applications connected requests to users or how they dealt with authentication/authorization. The idea of sessions and session managment was something new to me and an eye opener to how applications 'remember' a signed in user. I was familiar with the idea of cookies and how they provide a way for http to 'store' data about a user, but I had no real experience with them begin used.
- signature

  > A digital signature is a mathematical technique used to validate the authenticity and integrity of a message, software, or digital document. These are some of the key features of it. (geeksforgeeks)

  - I was familiar with the idea of signatures but the idea was a bit fuzzy. So for this project I went and read up on it a bit. The reason signatures are important are because its used to authenticate the origin of a digital file. This is used with sessions to verify a session is legit on the server side.

- token
  - A token is a sequence of bits passed continuously between nodes in a fixed order and enabling a node to transmit information.
  - I learned about tokens and how they are used to permit to the transmission of data from a server. I learned that my auth library (auth.js) uses token (specifically jwt) to create a session.

## Resources

- [authentication/authorization](https://nextjs.org/docs/app/guides/authentication)
- [auth.js](https://authjs.dev/getting-started/installation?framework=next.js)
- [server components](https://react.dev/reference/rsc/server-components)
- [server functions](https://react.dev/reference/rsc/server-functions)
- [signatures](https://www.geeksforgeeks.org/computer-networks/digital-signatures-certificates/)
- [nextjs](https://nextjs.org/docs)
- [react](https://nextjs.org/docs)
