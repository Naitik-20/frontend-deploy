import { Heart, ShieldCheck, Stethoscope, PawPrint } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <div className="about-page">

        {/* HERO */}
        <section className="about-hero">

          <div className="about-hero-content">
            <span className="about-eyebrow">
              ABOUT DR. SNOOPY
            </span>

            <h1>
              Caring For Pets,
              <br />
              Like Family
            </h1>

            <p>
              Dr. Snoopy was built with one simple mission:
              make quality pet healthcare, nutrition,
              grooming and expert veterinary guidance
              accessible to every pet parent.
            </p>
          </div>

          <div className="about-hero-image">
            <img
              src="https://images.unsplash.com/photo-1517849845537-4d257902454a"
              alt="Pet Care"
            />
          </div>

        </section>

        {/* STORY */}
        <section className="about-story">

          <div className="section-title">
            <span>Our Story</span>
            <h2>More Than Just A Pet Store</h2>
          </div>

          <p>
            At Dr. Snoopy, we believe pets deserve
            the same quality healthcare and attention
            that every family member receives.

            That's why we've created a platform where
            veterinary consultations, medicines,
            pet food, accessories, grooming products,
            and expert guidance come together
            in one trusted destination.
          </p>

        </section>

        {/* VALUES */}

        <section className="about-values">

          <div className="section-title">
            <span>What Drives Us</span>
            <h2>Our Core Values</h2>
          </div>

          <div className="values-grid">

            <div className="value-card">
              <Heart size={38}/>
              <h3>Compassion</h3>
              <p>
                Every product and service starts
                with genuine care for pets.
              </p>
            </div>

            <div className="value-card">
              <ShieldCheck size={38}/>
              <h3>Trust</h3>
              <p>
                Verified products and trusted
                veterinary recommendations.
              </p>
            </div>

            <div className="value-card">
              <Stethoscope size={38}/>
              <h3>Expert Care</h3>
              <p>
                Access professional consultations
                from certified veterinarians.
              </p>
            </div>

            <div className="value-card">
              <PawPrint size={38}/>
              <h3>Pet First</h3>
              <p>
                Every decision revolves around
                better lives for pets.
              </p>
            </div>

          </div>

        </section>

        {/* STATS */}

        <section className="about-stats">

          <div className="stat-card">
            <h3>10K+</h3>
            <span>Happy Pet Parents</span>
          </div>

          <div className="stat-card">
            <h3>500+</h3>
            <span>Premium Products</span>
          </div>

          <div className="stat-card">
            <h3>50+</h3>
            <span>Trusted Brands</span>
          </div>

          <div className="stat-card">
            <h3>24/7</h3>
            <span>Support & Guidance</span>
          </div>

        </section>

        {/* WHY CHOOSE US */}

        <section className="why-us">

          <div className="section-title">
            <span>Why Choose Us</span>
            <h2>Your Pet's Trusted Companion</h2>
          </div>

          <div className="why-grid">

            <div>
              ✓ Genuine Products
            </div>

            <div>
              ✓ Online Vet Consultations
            </div>

            <div>
              ✓ Fast Delivery
            </div>

            <div>
              ✓ Premium Nutrition
            </div>

            <div>
              ✓ Grooming Essentials
            </div>

            <div>
              ✓ Trusted By Pet Parents
            </div>

          </div>

        </section>

      </div>

      <style>{`

.about-page{
  background:#f6efe6;
}

/* HERO */

.about-hero{
  max-width:1300px;
  margin:auto;

  padding:90px 20px;

  display:grid;
  grid-template-columns:1.1fr 1fr;
  gap:60px;
  align-items:center;
}

.about-eyebrow{
  display:inline-block;

  background:#fff4dd;
  color:#f5a623;

  padding:10px 18px;

  border-radius:999px;

  font-size:13px;
  font-weight:700;

  margin-bottom:20px;
}

.about-hero h1{
  font-family:'Playfair Display', serif;
  font-size:72px;
  line-height:1.05;

  color:#0b3d2e;

  margin-bottom:24px;
}

.about-hero p{
  font-size:18px;
  color:#666;
  line-height:1.9;
}

.about-hero-image img{
  width:100%;
  border-radius:32px;
  object-fit:cover;

  box-shadow:
    0 25px 60px rgba(0,0,0,.08);
}

/* SECTION TITLE */

.section-title{
  text-align:center;
  margin-bottom:50px;
}

.section-title span{
  color:#f5a623;
  font-weight:700;
}

.section-title h2{
  font-family:'Playfair Display', serif;
  font-size:52px;
  color:#0b3d2e;
  margin-top:10px;
}

/* STORY */

.about-story{
  max-width:900px;
  margin:auto;

  padding:30px 20px 90px;
  text-align:center;
}

.about-story p{
  font-size:18px;
  line-height:2;
  color:#666;
}

/* VALUES */

.about-values{
  max-width:1300px;
  margin:auto;
  padding:40px 20px 90px;
}

.values-grid{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:25px;
}

.value-card{
  background:white;

  border-radius:24px;

  padding:35px;

  text-align:center;

  box-shadow:
    0 10px 30px rgba(0,0,0,.05);

  transition:.3s;
}

.value-card:hover{
  transform:translateY(-8px);
}

.value-card svg{
  color:#f5a623;
}

.value-card h3{
  margin:18px 0 10px;
  color:#0b3d2e;
}

.value-card p{
  color:#777;
}

/* STATS */

.about-stats{
  max-width:1200px;
  margin:auto;

  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:25px;

  padding:20px;
}

.stat-card{
  background:#0b3d2e;
  color:white;

  border-radius:24px;

  padding:40px;

  text-align:center;
}

.stat-card h3{
  font-size:42px;
  color:#f5a623;
}

.stat-card span{
  opacity:.9;
}

/* WHY US */

.why-us{
  max-width:1200px;
  margin:auto;

  padding:100px 20px;
}

.why-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:22px;
}

.why-grid div{
  background:white;

  padding:24px;

  border-radius:18px;

  font-weight:600;

  box-shadow:
    0 10px 24px rgba(0,0,0,.04);
}

/* MOBILE */

@media(max-width:1000px){

  .about-hero{
    grid-template-columns:1fr;
  }

  .values-grid{
    grid-template-columns:repeat(2,1fr);
  }

  .about-stats{
    grid-template-columns:repeat(2,1fr);
  }

  .why-grid{
    grid-template-columns:1fr;
  }

  .about-hero h1{
    font-size:52px;
  }
}

@media(max-width:640px){

  .values-grid{
    grid-template-columns:1fr;
  }

  .about-stats{
    grid-template-columns:1fr;
  }
}

      `}</style>
    </>
  );
}