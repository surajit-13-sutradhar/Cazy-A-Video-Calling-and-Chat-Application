// INNGEST client
import { Inngest } from 'inngest';
import { connectDB } from './db.js';

// Initialize the Inngest client with your account's default settings
export const inngest = new Inngest({ id: "cazy"})

const syncUser = inngest.createFunction(
    {id: "sync-user"},
    {event: "clerk/user.created"},
    async ({event}) => {
        await connectDB();

        const {id, email_addresses, first_name, image_url} = event.data;

        const newUser = {
            clerkId: id,
            email: email_addresses[0]?.email_address,
            name: `${first_name} || "" ${last_name} || ""`,
            image: image_url || "",
        }

        await User.create(newUser);

        // 
    }
)

const deleteUserFromDB = inngest.createFunction(
    {id: "delete-user"},
    {event: "clerk/user.deleted"},
    async ({event}) => {
        const {id} = event.data;
        await User.deleteOne({clerkId: id});
        // await deleteStreamUser(id.toString());
    }
)

// creating an empty array to export future inngest functions
export const functions = [syncUser, deleteUserFromDB];
