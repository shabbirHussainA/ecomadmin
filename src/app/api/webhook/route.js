// todo check it on my windows 
import Stripe from "stripe";
import {stripe} from "../../../lib/stripe"
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import {Order} from '../../../models/Order'

export async function POST(req){
    const body = await req.text();
    const signature = headers().get('Stripe-Signature')

    let event;
    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            'whsec_634d3142fd2755bd61adaef74ce0504bd2044848c8aac301ffdb56339a0ca78d', //todo in windows
        )
    } catch (error) {
        return new NextResponse("invalid signature",{status:400});
    }
    const session = event.data.object;

    if(event.type === "checkout.session.completed"){
        console.log("payment was successful for user " )
        // const subscription = await stripe.subscriptions.retrieve(session.subscription) this is for subscription base model
        // console.log("suscription" + subscription)

        const orderId = session.metadata.orderId;
        const paid = session.payment_status === 'paid';
        if (orderId && paid) {
            // Update the order status to paid in the database
            await Order.findByIdAndUpdate(orderId, {
              paid: true,
            });
          }
          console.log(`Unhandled event type ${event.type}`);
        
    }
    return new NextResponse('ok', {status:200})
}