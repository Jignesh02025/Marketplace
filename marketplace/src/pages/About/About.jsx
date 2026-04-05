import "./About.css";

const VALUES = [
  { icon: "🏅", title: "Handcrafted", desc: "Every piece shaped by skilled artisan hands." },
  { icon: "💎", title: "Certified", desc: "BIS hallmarked for guaranteed quality." },
  { icon: "🤝", title: "Trusted", desc: "Thousands of happy customers nationwide." },
  { icon: "♻️", title: "Sustainable", desc: "Ethically sourced materials, always." },
];

export default function About() {
  return (
    <div className="about-container">
      {/* Hero */}
      <div className="about-hero">
        <h1>About Marketplace</h1>
        <p>
          Founded with a passion for timeless elegance, we bring the world's
          finest jewellery collections to your fingertips — crafted with love,
          delivered with care.
        </p>
      </div>

      {/* Story & Mission */}
      <div className="about-content">
        <div className="about-section">
          <span className="about-section-icon">📖</span>
          <h2>Our Story</h2>
          <p>
            Marketplace was born from a simple idea: make fine jewellery
            accessible to everyone. What started as a small family venture has
            grown into a platform trusted by collectors and everyday shoppers
            alike across India.
          </p>
        </div>

        <div className="about-section">
          <span className="about-section-icon">🎯</span>
          <h2>Our Mission</h2>
          <p>
            We are committed to transparency, quality, and delight. Every
            product on our platform is curated, certified, and delivered with
            a promise — your satisfaction is our success.
          </p>
        </div>

        <div className="about-section">
          <span className="about-section-icon">✨</span>
          <h2>What Sets Us Apart</h2>
          <p>
            Unlike mass-market platforms, every listing is personally reviewed
            by our team. We work directly with artisans to ensure authenticity
            and fair practices from workshop to your doorstep.
          </p>
        </div>

        <div className="about-section">
          <span className="about-section-icon">📦</span>
          <h2>Our Promise</h2>
          <p>
            From secure packaging to hassle-free returns, we stand behind every
            order. Our 7-day return policy and dedicated support team are here
            whenever you need us.
          </p>
        </div>
      </div>

      {/* Values strip */}
      <div className="about-values">
        <h2>What We Stand For</h2>
        <div className="values-grid">
          {VALUES.map((v) => (
            <div className="value-card" key={v.title}>
              <span>{v.icon}</span>
              <h4>{v.title}</h4>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
