import  {Client , Account , Databases , Storage, TablesDB} from "appwrite"


const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1') // Your API Endpoint
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECTID!);                 // Your project ID

export const account = new Account(client);
export  const database = new TablesDB(client)
export const storage = new Storage(client);

