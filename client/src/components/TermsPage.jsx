import "./PolicyPage.css";

export default function TermsPage() {
  return (
    <div className="policy-page">

      <div className="policy-container">

        <h1 className="policy-title">
          Terms & Conditions
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
              on how to write your own document of Terms & Conditions.
              You should not rely on this article as legal advice or as
              recommendations regarding what you should actually do.
            </p>

            <p>
              We recommend that you seek legal advice to help you
              understand and assist you in the creation of your own
              Terms & Conditions.
            </p>
          </div>

        </div>

        {/* SECTION 2 */}

        <div className="policy-section">

          <div className="policy-left">
            <h2>Terms & Conditions - The Basics</h2>
          </div>

          <div className="policy-right">
            <p>
              Terms and Conditions (“T&C”) are a set of legally binding
              terms defined by you, as the owner of this website.
              The T&C set forth the legal boundaries governing the
              activities of the website visitors, or your customers,
              while they visit or engage with this website.
            </p>

            <p>
              T&C should be defined according to the specific needs
              and nature of each website. For example, a website
              offering products to customers in e-commerce
              transactions requires T&C that are different from
              the T&C of a website only providing information.
            </p>

            <p>
              T&C provide you as the website owner the ability
              to protect yourself from potential legal exposure.
            </p>
          </div>

        </div>

        {/* SECTION 3 */}

        <div className="policy-section">

          <div className="policy-left">
            <h2>What to Include in the T&C Document</h2>
          </div>

          <div className="policy-right">
            <p>
              Generally speaking, T&C often address these types of issues:
              who is allowed to use the website, payment methods,
              declarations that the website owner may change offerings
              in the future, warranties, intellectual property,
              account suspension and much more.
            </p>

            <p>
              To learn more about this, check out our article
              “Creating a Terms and Conditions Policy”.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}