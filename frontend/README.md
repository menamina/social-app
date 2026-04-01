# Social Media App

A threads/twitter clone social media app

## Built with

- Node.js
- Express and express sessions
- Passport
- PostgreSQL
- Prisma as the ORM for PostgreSQL
- JavaScript
- React
- CSS

## Application Features

- creating/deleting posts
- liking, commenting, reposting
- direct messaging
- direct messaging searching through messages as well as users to message
- blocking/unblocking users
- general search functionality for usernames as well as posts or comments
- editing account

## My experience building this

- I chose to use passport for authentication with this application as it is something I am becoming more comfortable with after using it in a previous project; I understand it more than when I did while reading about it and first implementing it in my Members Only project.

- Since learning about Prisma I have enjoyed using it as my ORM and am continuously learning about different ways to structure my schema. For example, in this application I made posts AND comments both Posts in the schema as this helped figure out which posts were strictly posts or which posts were comments under a post.

- I still enjoy building with React and find that I still have a lot to learn although I have come a long way already. My goal is to be more effecient in the way I store data and hit API endpoints. I realized at the very end of this project that in a real world application most applications are going to render the comments under a post AFTER that post has been clicked. - Still a lot to learn, but I'm enjoying it.

## Goals

- One goal for my following projects away from the Odin Project will be to think broadly about applications I am building in the real world scenario. As stated above, real applications do an api fetch after a post has been clicked on and not when the feed is first loaded.

- Another goal would be to implement sanitization; After learning a little bit about it in the Odin Project once I just forgot to keep implementing it and sanitization is very import.

- I would like to do more testing and mocking in future projects
