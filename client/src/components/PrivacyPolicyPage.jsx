import "./PolicyPage.css";

export default function PrivacyPolicyPage() {
  return (
    <div className="policy-page">

      <div className="policy-container">

        <h1 className="policy-title">
          Privacy Policy
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
              on how to write your own document of a Privacy Policy.
            </p>

            <p>
              You should not rely on this article as legal advice
              or as recommendations regarding what you should actually do,
              because we cannot know in advance what are the specific
              privacy policies you wish to establish between your business
              and your customers and visitors.
            </p>

            <p>
              We recommend that you seek legal advice to help you
              understand and assist you in the creation of your own
              Privacy Policy.
            </p>
          </div>

        </div>

        {/* SECTION 2 */}

        <div className="policy-section">

          <div className="policy-left">
            <h2>Privacy Policy - The Basics</h2>
          </div>

          <div className="policy-right">
            <p>
              A privacy policy is a statement that discloses some or all
              of the ways a website collects, uses, discloses, processes,
              and manages the data of its visitors and customers.
            </p>

            <p>
              It usually also includes a statement regarding the website’s
              commitment to protecting its visitors’ or customers’ privacy,
              and an explanation about the different mechanisms the website
              is implementing in order to protect privacy.
            </p>

            <p>
              Different jurisdictions have different legal obligations
              of what must be included in a Privacy Policy.
            </p>
          </div>

        </div>

        {/* SECTION 3 */}

        <div className="policy-section">

          <div className="policy-left">
            <h2>What to Include in the Privacy Policy</h2>
          </div>

          <div className="policy-right">
            <p>
              Generally speaking, a Privacy Policy often addresses these
              types of issues:
            </p>

            <p>
              • The types of information the website collects  
              <br />
              • How the website collects data  
              <br />
              • Why the website collects personal information  
              <br />
              • Sharing information with third parties  
              <br />
              • Rights of visitors and customers  
              <br />
              • Policies regarding minors’ data collection  
            </p>

            <p>
              To learn more about this, check out our article
              “Creating a Privacy Policy”.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}