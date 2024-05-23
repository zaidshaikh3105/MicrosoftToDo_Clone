import { Client, Account } from "appwrite";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("664ef0470004d76b3724"); // Replace with your project ID

export const account = new Account(client);
export { ID } from "appwrite";
