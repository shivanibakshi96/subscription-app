import React from 'react';

const Checkout = () => {
  return (
    <div className="sr-root">
        <div className="sr-main">
            <h1>Choose a plan</h1>
            <div class="price-table-container">
                <section>
                    <form action="/create-checkout-session" method="POST">
                        <input type="hidden" id="basicPrice" name="priceId" />
                        <div class="name">Basic</div>
                        <div class="price">$99</div>
                        <div class="duration">per month</div>
                        <button id="basic-plan-btn">Select</button>
                    </form>
                </section>
                <section>
                    <form action="/create-checkout-session" method="POST">
                        <input type="hidden" id="proPrice" name="priceId" />
                        <div class="name">Premium</div>
                        <div class="price">$199</div>
                        <div class="duration">per month</div>
                        <button id="pro-plan-btn">Select</button>
                    </form>
                </section>
            </div>
        </div>
    </div>
  );
};

export default Checkout;