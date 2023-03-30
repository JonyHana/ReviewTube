# ReviewTube
A website that allows users to post YouTube video response reviews/comments in a Medium-like article layout.

*Looking for environment variables?* [Click here](#environment-variables).

## How to Deploy to Railway.app

**BEFORE CONTINUING**: You'll want to make sure to have your Google OAuth 2.0 credential keys and YouTube Data API v3 key ready. You will need to access the Google Cloud console and create a new project, that will be used for this project, in order to generate the necessary keys.

Because this app is structured as an isolated monorepo, it is best if you got yourself familiar with how monorepo support works on Railway. [Click here](https://docs.railway.app/deploy/monorepo#isolated-monorepo) to learn more.

### [Adding the Services]

#### Backend Service:
To deploy the backend service, you will need to do the following:
1. On your new empty Railway project, right click and choose "GitHub Repo" under "Add New Service". Go through the steps of allowing Railway access to your fork of this repository.
2. The automatic deployment should end up failing but this is normal. This is because Nixpacks failed to generate a build due the "Root Directory" not being set to the backend folder. To do this, go to "Settings" in the backend deployment window, then under "Service" set the "Root Directory" to `/backend`. Click the checkmark to apply changes.
3. After the deployment process succeeds, you will notice that if you click on "Deploy Logs" you will see that the Passport.js OAuth2Strategy threw an error. This is because the environment variables for Google OAuth credentials haven't been set yet. The next steps shortly will show you how to do this, including the other necessary variables.
4. Before setting the other environment variables, you'll want to first add a new MySQL service and Redis service. After doing this, you won't need to do anything else with both MySQL and Redis.
5. To set the [environment variables](#environment-variables), go to the "Variables" in the backend deployment window. You can either set new variables individually or use the raw editor to enter in multiple variables. It's best if you did this approach with the raw editor to prevent multiple attempts of redeployments when setting new variables individually. **NOTE**: We'll set the `FRONTEND_URL` variable later after we've deployed the frontend service. You can skip setting that for now.
6. After doing this and once the auto redeployment succeeds, you'll need to exposed the API url. To do this, go to "Settings" in the backend deployment window and click "Generate Domain". You will need this to set the `VITE_API_URL` environment variable, which we'll go over in the next section.
7. Optional: You'll probably want to rename the service to something else besides "ReviewTube" to distinguish the frontend service from the backend. To do this, go to "Settings" in the backend deployment window and under "Service Name" rename the service; you can just name it "Backend" for simplicity.

#### Frontend Service:
To deploy the frontend service, you will need to do the following:
1. Repeat step 1 under the [Backend Service](#backend-service) section.
2. Repeat step 2 as well under the Backend Service section, but set the "Root Directory" to `/frontend`.
3. After, set the `VITE_API_URL` environment variable to the generated domain that was provided for the backend service.  The generated URL will not include the https:// prefix so make sure to include that.
4. After, set the `PORT` variable to 8080. This must be 8080 otherwise you will get a CORS error whenever you try to reach the static file server (frontend service).

### [Environment Variables]
#### Frontend:
`VITE_API_URL`: The URL for the API endpoint of your deployed Railway backend.
`PORT`: Set this to 8080. Used for the static file server that'll provide the Vite-built asset files.
#### Backend:
`NODE_ENV`: Set to either `development` or `production`.
`GOOGLE_CLIENT_ID`: An "OAuth 2.0 Client IDs" Web application key that can be generated on Google Cloud, paired with `GOOGLE_CLIENT_SECRET`.
`GOOGLE_CLIENT_SECRET`: Similar to `GOOGLE_CLIENT_ID`.
`YT_API_KEY`: The API key credentials for YouTube Data API v3 that you can generate on Google Cloud.
`FRONTEND_URL`: The URL for the static file server that'll provide the Vite-built asset files.
`SESSION_SECRET_KEY`: Used for express-session. This can be whatever you want to set it to; for example, you can use some long random string for simplicity.
`DATABASE_URL`: The URL that Prisma will use for connecting to the MySQL database. You can just set this to `${{MySQL.MYSQL_URL}}` if your database is provisioned inside the Railway project.
`REDIS_URL`: The URL that the Express Redis client will connect to. You can just set this to `${{Redis.REDIS_URL}}` if Redis is provisioned inside the Railway project.

#### Note (for Google OAuth):
You will need to be signed in to your GMail account before you can continue.
1. Go to Google Cloud's API & Services page.
1. Go to the "OAuth 2.0 Client IDs" section that can be found under "Credentials" in the Google Cloud's APIs & Services.
2. Once you're inside the page, enter the API endpoint OAuth callback URL inside the "Authorized redirect URIs" section. The URL should look something like this: `https://{RAILWAY_API_URL}/oauth2/redirect/google`
