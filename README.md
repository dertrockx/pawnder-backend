# Pawnder backend

- because y not

Steps to run this project:

1. Run `yarn` or `yarn install` command
2. Copy `.env.example` into `.env` and ask [@dertrockx](https://github.com/dertrockx) for the ff. information

- credentials to our cloudinary account
- credentials for the database
- configuration for refresh and auth token

3. Run `docker-compose up -d` command
4. Run `yarn schema:sync` command
5. Run `yarn dev:server` command

Steps to run for testing

1. Run `yarn seed` to generate dummy data ( if you want )
2. Open postman / insomnia for testing endpoints, and voi·la
