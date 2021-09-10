const stripe = require("stripe")(process.env.STRIPE_SEC_KEY);
const postmark = require("postmark")
const serverToken = "9a0f11da-6b65-44cb-ac5c-464fc2c73ff7"
// const pmClient = new postmark.ServerClient(serverToken);

import dbConnect from "../../../lib/db";
import Customer from "../../../models/customer";


const getSubscriber = async req => {
    const {token, name, email} = req.body;
    return await stripe.customers.create({
		name: name,
		email: email,
		source: token.id,
	});
}

const payForTrial = async (subscriber, paymentMethod) => {
    const price = await stripe.prices.retrieve('price_1JU09cKSHXoedCcCu3FlPkdG');
    stripe.prices.retrieve('price_1JU09cKSHXoedCcCu3FlPkdG');
    const piInst = await stripe.paymentIntents.create({
        customer: subscriber.id,
        currency: 'usd',
        amount: price.unit_amount,
    });

    return await stripe.paymentIntents.confirm(
        piInst.id,
        { payment_method: paymentMethod.id }
    );
}

const payForBasic = async subscriber => {
    const tsAfterTrial = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;

    return await stripe.subscriptions.create({
        customer: subscriber.id,
        items: [{ price: 'price_1JSCFIKSHXoedCcCJ1BmYfQ5' }],
        trial_end: tsAfterTrial,
        billing_cycle_anchor: tsAfterTrial,
    });
}

const startPlan = async (req, res) => {
    const {name, email, method} = req.body;
         
    const oldOne = await Customer.find({email: email})
    if (oldOne.length > 0) {
        return {error: "You've been already registered before ..."};
    }

    const subscriber = await getSubscriber(req);
    const subs_trial = await payForTrial(subscriber, method.paymentMethod);
    const subs_basic = await payForBasic(subscriber);
    
    await Customer.create({
        customer_id: subs_basic.customer,
        name: name, 
        email: email,
        subscription: subs_basic.id,
        paid_status: subs_basic.status,
        date_updated: subs_basic.start_date
    })

    // pmClient.sendEmail({
    //     From: "karen@transforminggardens.com.au",
    //     To: "test@blackhole.postmarkapp.com",
    //     Subject: "Hello from Postmark!",
    //     HtmlBody: `Dear ${name}, You have started a trial plan today.`
    // }, function(err, data) {
    //     if (err)
    //         return {error: err};
    // });
    
    return {data: "success"};
}

const updatePlan = async (req, res) => {
    const { name, email } = req.body
     
    const oldOne = await Customer.find({email: email})

    if (oldOne.length > 0) {
        const subs_content = await stripe.subscriptions.update(oldOne[0].subscription, { trial_end: 'now' });
        await Customer.updateOne(
        { email: email},
        { $set: {
            customer_id: subs_content.customer,
            subscription: subs_content.id,
            paid_status: subs_content.status,
            date_updated: subs_content.start_date
        }},
        { upsert: true });

        return {data: {subscription: subs_content}};
    }

    return {error: "You've not been registered a plan yet ..."};
}

const cancelPlan = async (req, res) => {
    const { email } = req.body
     
    const oldOne = await Customer.find({email: email})

    if (oldOne.length > 0) {
        const subs_content = await stripe.subscriptions.del(oldOne[0].subscription);
        await Customer.deleteOne({email: email})
        return {data: {subscription: subs_content}};
    }

    return {error: "You've not been registered a plan yet ..."};
}

const refund = async (req, res) => {
    const {paymentIntent} = req.body
    let result = await stripe.refunds.create({
		payment_intent: paymentIntent,
    });
    res.json({data: result})
}

const login = async (req) => {
    const { email } = req.body
     
    const oldOne = await Customer.find({email: email})

    if (oldOne.length > 0) {
        return {data: {customer_id: oldOne[0].customer_id, name: oldOne[0].name, email: email}};
    }

    return {error: "You've not been registered a plan yet ..."};
}

const retrieve = async (req) => {
    const { email } = req.body
     
    const oldOne = await Customer.find({email: email})
    
    if (oldOne.length > 0) {
        const subs_content = await stripe.subscriptions.retrieve(oldOne[0].subscription);
        return {data: {subscription: subs_content}};
    }

    return {error: "You've not been registered a plan yet ..."};
}

const customerPortal = async (req) => {
    const { email } = req.body

    const oldOne = await Customer.find({email: email})

    if (oldOne.length > 0) {
        const session = await stripe.billingPortal.sessions.create({
            customer: oldOne[0].customer_id,
            return_url: "http://localhost:3000/dashboard",
        });

        return { url: session.url };
    }

    return { error: "You've not been registered a plan yet ..." }
}

export default async function handler(req, res) {
    
    await dbConnect();
    
    const { slug } = req.query;
    if (slug === 'confirm') {
        // console.log ("Payment Confirm!")
        const intent = await startPlan(req, res);
        res.json(intent);        
    } else if (slug === 'update') {
        // console.log ("Payment Update!")
        const subscription = await updatePlan(req, res)
        res.json(subscription);
    } else if (slug === 'cancel') {
        // console.log ("Payment Cancel!")
        const subscription = await cancelPlan(req, res)
        res.json(subscription);
    } else if (slug === 'login') {
        // console.log ("Login!")
        const resSign = await login(req);
        res.json(resSign);
    } else if (slug === 'retrieve') {
        const subscription = await retrieve(req);
        res.json(subscription);
    } else if (slug === 'portal') {
        const url = await customerPortal(req);
        res.json(url);
    }
}