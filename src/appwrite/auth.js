import { Client, Databases } from "appwrite";
const client = new Client();

client
  .setEndpoint(import.meta.env.APPWRITE_ENDPOINT)
  .setProject(import.meta.env.APPWRITE_PROJECT_ID);

const databases = new Databases(client);

export { client, databases };
