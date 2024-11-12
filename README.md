# NextJS Netlify Deployment Example

This example shows how to create a simple blog with Postgres and Blob Storage for uploads using Netlify and Prisma.

## 1. Create a Prisma database

Netlify doesn't offer a Postgres database, or any relational databases. Instead we will use Primsa's new Postgres feature, but any Postgres database will work for this setup.

1. Go to https://console.prisma.io/
2. Create a new database
3. Copy the credentials somewhere safe / local (we will use them in the next step)

## 2. Deploy the app

1. Clone this repo
2. Push it to your own GitHub account
3. Go to https://app.netlify.com/ and choose "Import Repository"
4. Select the repo you just pushed
5. In the configuration section, add the environment variables from Step 1 (`DATABASE_URL` and `PULSE_API_KEY`)
6. Add an additional environment variable:
  
    ```
    BLOB_STORE_NAME=media
    ```

    This is used by our NextJS App to store and retrieve cover image uploads from Netlify's blob store.

    We also include a very simple image API endpoint to proxy the blobs through a NextJS route handler (see [`src/app/images/route.ts`](./src/app/images/route.ts) for details).

7. Click deploy

You're done! Now you should have a NextJS app with Postgres and File upload support running on Netlify.