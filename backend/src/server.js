import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { clerkMiddleware } from '@clerk/express';
import { inngest, functions } from './config/inngest.js';
import { serve } from 'inngest/express';

const app = express();
app.use(express.json());

app.use(clerkMiddleware()); // to check auth status of request/ user

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get("/", (req, res) => {
    res.send("Hello crow");
})

console.log(ENV.MONGO_URI); // for testing if env variable is working

// app.listen(ENV.PORT, () => {
//     console.log("Server started on port " + ENV.PORT)
//     connectDB();
// });

const startServer = async() => {
    try {
        await connectDB();
        if (ENV.NODE_ENV !== "production") {
            app.listen(ENV.PORT, () => {
                console.log("Server started on port " + ENV.PORT);
            });
        }
    }
    catch (error) {
        console.error("error starting server:", error);
        process.exit(1);
    }
}

startServer();

export default app;
