//this is to sigin the user its working
import { NextAuthOptions } from "next-auth";
import dbConnect from "../../../../lib/dbConnect";
import UserModal from "@/models/UserModel";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import Email from "next-auth/providers/email";

export const authOptions = {
    // Adding auth options
    providers: [
        CredentialsProvider({ // Adding credentials for login purpose
            id: "credentials",
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) { // Checking the user
                await dbConnect(); // Connect to database
                try {
                    const user = await UserModal.findOne({
                        $or: [
                            { username: credentials.identifier },
                            { email: credentials.identifier }
                        ]
                    });

                    if (!user) {
                        throw new Error("The user does not exist");
                    }

                    if (user.role === 'customer') {
                        throw new Error("customers cannot log in here");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if (isPasswordCorrect) {
                        return user;
                    } else {
                        throw new Error("Incorrect password");
                    }
                } catch (error) {
                    throw new Error(error.message || "An error occurred during authorization");
                }
            }
        }),
    ],
    // Modifying the session and JWT
    callbacks: {
        // Saving user values in token and then to the sessions
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.role = user?.role;
                token.username = user?.username;
                
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.role = token.role;
                session.user.username = token.username;
            }
            return session;
        },
    },
    // Creating pages
    pages: {
        signIn: '/sign-in',
    },
    // Declaring who will get the session those who have JWT
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET_KEY,
};
