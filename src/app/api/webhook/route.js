import Stripe from "stripe";
import { stripe } from "../../../lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Order } from '../../../models/Order';

// This function handles POST requests to the webhook endpoint
export async function POST(req) {
    // Read the request body as text
    const body = await req.text();
    // Retrieve the Stripe signature from the headers
    const signature = headers().get('Stripe-Signature');

    let event;
    try {
        // Construct the Stripe event using the body, signature, and webhook secret
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            'whsec_634d3142fd2755bd61adaef74ce0504bd2044848c8aac301ffdb56339a0ca78d' // TODO: Replace with your actual webhook secret
        );
    } catch (error) {
        // Return a 400 response if the signature verification fails
        return new NextResponse("Invalid signature", { status: 400 });
    }

    // Extract the session object from the event data
    const session = event.data.object;

    // Handle the "checkout.session.completed" event
    if (event.type === "checkout.session.completed") {
        console.log("Payment was successful for user");

        // For subscription-based models, you can retrieve the subscription
        // const subscription = await stripe.subscriptions.retrieve(session.subscription);
        // console.log("Subscription: " + subscription);

        // Extract orderId and payment status from the session metadata
        const orderId = session.metadata.orderId;
        const paid = session.payment_status === 'paid';

        if (orderId && paid) {
            // Update the order status to paid in the database
            await Order.findByIdAndUpdate(orderId, {
                paid: true,
            });
        }
    } else {
        // Log unhandled event types
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return new NextResponse('ok', { status: 200 });
}
