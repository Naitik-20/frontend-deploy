import "./PolicyPage.css";

export default function ShippingPolicyPage() {
  return (
    <div className="policy-page">

      <div className="policy-container">

        <h1 className="policy-title">
          Shipping Policy
        </h1>

        {/* SECTION 1 */}

        <div className="policy-section">

          <div className="policy-left">
            <h2>A Legal Disclaimer</h2>
          </div>

          <div className="policy-right">
            <p>
              The explanations and information provided on this page
              are only general and high-level explanations and information
              on how to write your own document of a Shipping Policy.
            </p>

            <p>
              You should not rely on this article as legal advice
              or as recommendations regarding what you should actually do,
              because we cannot know in advance what are the specific
              shipping policies that you wish to establish between your
              business and your customers.
            </p>

            <p>
              We recommend that you seek legal advice to help you
              understand and assist you in the creation of your own
              Shipping Policy.
            </p>
          </div>

        </div>

        {/* SECTION 2 */}

        <div className="policy-section">

          <div className="policy-left">
            <h2>Shipping Policy - The Basics</h2>
          </div>

          <div className="policy-right">
            <p>
              A Shipping Policy is a legally binding document that
              establishes the legal relations between you and your
              customers. It explains your shipping process,
              timelines, and responsibilities.
            </p>

            <p>
              It helps customers understand what to expect
              from your service and gives them clarity about
              delivery timelines and shipping procedures.
            </p>

            <p>
              Having a clear Shipping Policy improves trust
              and helps avoid confusion regarding order fulfillment.
            </p>
          </div>

        </div>

        {/* SECTION 3 */}

        <div className="policy-section">

          <div className="policy-left">
            <h2>What to Include in the Shipping Policy</h2>
          </div>

          <div className="policy-right">
            <p>
              Generally speaking, a Shipping Policy often addresses:
            </p>

            <p>
              • Order processing timeframes  
              <br />
              • Shipping charges and delivery fees  
              <br />
              • Domestic and international shipping methods  
              <br />
              • Delivery timelines  
              <br />
              • Tracking information  
              <br />
              • Delays and service interruptions  
            </p>

            <p>
              These details help customers understand how
              and when they will receive their orders.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}