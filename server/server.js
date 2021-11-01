const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");

const envFilePath = path.resolve(__dirname, './.env');
require("dotenv").config({ path: envFilePath });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.static(process.env.STATIC_DIR));
app.use(
  express.json({
    verify: function (req, res, buf) {
      if (req.originalUrl.startsWith("/webhook")) {
        req.rawBody = buf.toString();
      }
    },
  })
);

app.get("/", (req, res) => {
  const filePath = path.resolve(process.env.STATIC_DIR + "/index.html");
  res.sendFile(filePath);
});

// Fetch the checkout session to display the JSON result on the success page
app.get("/checkout-session", async (req, res) => {
  const { sessionId } = req.query;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  res.send(session);
});

app.post("/create-checkout-session", async (req, res) => {
  const domainURL = process.env.DOMAIN;
  console.log("domainURL: ", domainURL);
  console.log("req.body: ", req.body);
  // const { priceId } = req.body;
  const priceId = "price_1JprBFSCaXCb63K29l63K3ov";   // Using basic price Id only for testing purposes
  console.log("priceId: ", priceId);
  // Create new checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${domainURL}/canceled.html`,
    });
    return res.redirect(303, session.url);
  } catch (e) {
    res.status(400);
    return res.send({
      error: {
        message: e.message,
      }
    });
  }
});

app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    basicPrice: process.env.BASIC_PRICE_ID,
    proPrice: process.env.PRO_PRICE_ID
  });
});

// app.post('/customer-portal', async (req, res) => {
//   const { sessionId } = req.body;
//   const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
//   const returnUrl = process.env.DOMAIN;
//   const portalSession = await stripe.billingPortal.sessions.create({
//     customer: checkoutSession.customer,
//     return_url: returnUrl,
//   });
//   res.redirect(303, portalSession.url);
// });

// Webhook handler for asynchronous events
app.post("/webhook", async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event
    data = event.data;
    eventType = event.type;
  } else {
    data = req.body.data;
    eventType = req.body.type;
  }
  if (eventType === "checkout.session.completed") {
    console.log(`Payment received!`);
  }
  res.sendStatus(200);
});

app.listen(4242, () => console.log('Listening to port 4242'));