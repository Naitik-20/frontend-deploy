import "./PolicyPage.css";

export default function RefundPolicyPage() {
  return (
    <div className="policy-page">

      <div className="policy-container">

        <h1 className="policy-title">
          Refund Policy
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
              on how to write your own document of a Refund Policy.
            </p>

            <p>
              You should not rely on this article as legal advice
              or as recommendations regarding what you should actually do,
              because we cannot know in advance what are the specific
              refund policies that you wish to establish between your
              business and your customers.
            </p>

            <p>
              We recommend that you seek legal advice to help you
              understand and assist you in the creation of your own
              Refund Policy.
            </p>
          </div>

        </div>

        {/* SECTION 2 */}

        <div className="policy-section">

          <div className="policy-left">
            <h2>Refund Policy - The Basics</h2>
          </div>

          <div className="policy-right">
            <p>
              A Refund Policy is a legally binding document that
              establishes the legal relations between you and your
              customers regarding how and if refunds will be provided.
            </p>

            <p>
              Online businesses selling products are sometimes required
              to present their product return and refund policies in order
              to comply with consumer protection laws.
            </p>

            <p>
              A clear Refund Policy also helps avoid confusion
              and legal disputes from customers who may not be
              satisfied with their purchases.
            </p>
          </div>

        </div>

        {/* SECTION 3 */}

        <div className="policy-section">

          <div className="policy-left">
            <h2>What to Include in the Refund Policy</h2>
          </div>

          <div className="policy-right">
            <p>
              Generally speaking, a Refund Policy often addresses:
            </p>

            <p>
              • Eligibility for refunds  
              <br />
              • Timeframe for requesting refunds  
              <br />
              • Conditions for returns and exchanges  
              <br />
              • Whether refunds are full or partial  
              <br />
              • Non-refundable products or services  
              <br />
              • Processing time for refunds  
            </p>

            <p>
              These details help customers better understand
              your return and refund procedures.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}