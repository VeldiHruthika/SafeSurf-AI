import React, { useMemo, useState } from "react";
import products from "../data/products";
import "../styles/pharmacy.css";

const categories = [
  "All",
  "Skin & Personal Care",
  "Cold, Cough & Allergy",
  "Digestive Health",
  "Pain & First Aid",
  "Women's Health",
  "Vitamins & Supplements",
  "Health Devices",
];

/* =========================================================
   ICONS
   Small line-icon set (no emoji), matching the app's
   "clipped-corner icon box" visual language.
========================================================= */

const IconSearch = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconClose = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const IconCross = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="4" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const IconInfo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="11" x2="12" y2="16" />
    <circle cx="12" cy="7.4" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

const IconDroplet = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3.2s6.2 6.8 6.2 11.1a6.2 6.2 0 0 1-12.4 0C5.8 10 12 3.2 12 3.2z" />
  </svg>
);

const IconWind = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h11a2.2 2.2 0 1 0-2.2-2.2" />
    <path d="M3 13h14.5a2.4 2.4 0 1 1-2.4 2.4" />
    <path d="M3 18h8.5a1.8 1.8 0 1 0-1.8-1.8" />
  </svg>
);

const IconFlask = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 3h6" />
    <path d="M10 3v5.6l-5.2 8.7A2 2 0 0 0 6.5 20.5h11a2 2 0 0 0 1.7-3.2L14 8.6V3" />
    <path d="M8 15h8" />
  </svg>
);

const IconPlus = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const IconBloom = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="2.1" />
    <path d="M12 9.9c0-2.6-1.9-4.4-4-4.4s-0.2 4.4 4 4.4z" />
    <path d="M12 9.9c0-2.6 1.9-4.4 4-4.4s0.2 4.4-4 4.4z" />
    <path d="M12 14.1c0 2.6-1.9 4.4-4 4.4s-0.2-4.4 4-4.4z" />
    <path d="M12 14.1c0 2.6 1.9 4.4 4 4.4s0.2-4.4-4-4.4z" />
  </svg>
);

const IconCapsule = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.3 17.7a5 5 0 0 1 0-7.1l4.3-4.3a5 5 0 0 1 7.1 7.1l-4.3 4.3a5 5 0 0 1-7.1 0z" />
    <line x1="9.6" y1="14.4" x2="14.4" y2="9.6" />
  </svg>
);

const IconPulse = ({ size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2.5 13 7.5 13 9.5 7 13.5 19 15.7 13 21.5 13" />
  </svg>
);

const categoryIcons = {
  "Skin & Personal Care": IconDroplet,
  "Cold, Cough & Allergy": IconWind,
  "Digestive Health": IconFlask,
  "Pain & First Aid": IconPlus,
  "Women's Health": IconBloom,
  "Vitamins & Supplements": IconCapsule,
  "Health Devices": IconPulse,
};

/* =========================================================
   EXTERNAL SOURCE HELPERS
========================================================= */

const getMedkartUrl = (product) => {
  const query = encodeURIComponent(product.searchTerm || product.name);
  return `https://www.medkart.in/search/all?search=${query}`;
};

export default function Pharmacy() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = products
      .map((product) => {
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();
        const description = product.description.toLowerCase();
        const keywords = (product.keywords || []).map((keyword) =>
          keyword.toLowerCase()
        );

        let score = 0;

        if (query !== "") {
          if (name === query) score += 100;
          if (name.startsWith(query)) score += 80;
          if (name.includes(query)) score += 60;
          if (keywords.includes(query)) score += 50;
          if (keywords.some((keyword) => keyword.includes(query))) score += 40;
          if (category.includes(query)) score += 25;
          if (description.includes(query)) score += 15;

          const queryWords = query.split(/\s+/).filter(Boolean);

          queryWords.forEach((word) => {
            if (name.includes(word)) score += 20;
            if (keywords.some((keyword) => keyword.includes(word))) score += 15;
            if (category.includes(word)) score += 10;
            if (description.includes(word)) score += 5;
          });
        }

        return {
          ...product,
          searchScore: score,
        };
      })
      .filter((product) => {
        const matchesCategory =
          selectedCategory === "All" || product.category === selectedCategory;

        const matchesSearch = query === "" || product.searchScore > 0;

        return matchesCategory && matchesSearch;
      });

    if (query !== "") {
      result.sort((a, b) => {
        if (b.searchScore !== a.searchScore) {
          return b.searchScore - a.searchScore;
        }
        return a.name.localeCompare(b.name);
      });
    }

    if (sortOrder === "az") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortOrder === "za") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [search, selectedCategory, sortOrder]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <div className="pharmacy-page">

      {/* ================= HERO ================= */}

      <section className="pharmacy-hero">

        <div className="pharmacy-badge">
          <IconCross size={14} />
          Safe & Neutral Healthcare Products
        </div>

        <h1>SafeSurf AI Pharmacy</h1>

        <p>
          Explore healthcare products, wellness essentials and
          generic medicine options without promoting a specific
          pharmacy brand.
        </p>

      </section>


      {/* ================= MAIN CONTENT ================= */}

      <main className="pharmacy-content">

        {/* ================= SEARCH ================= */}

        <div className="pharmacy-search">

          <span className="pharmacy-search-icon">
            <IconSearch size={17} />
          </span>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products, symptoms or keywords..."
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <IconClose size={13} />
            </button>
          )}

        </div>


        {/* ================= CATEGORIES ================= */}

        <div className="pharmacy-categories">

          {categories.map((category) => (

            <button
              key={category}
              type="button"
              className={`pharmacy-category ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>

          ))}

        </div>


        {/* ================= SORT ================= */}

        <div className="pharmacy-categories pharmacy-sort">

          <button
            type="button"
            className={`pharmacy-category ${sortOrder === "default" ? "active" : ""}`}
            onClick={() => setSortOrder("default")}
          >
            Default
          </button>

          <button
            type="button"
            className={`pharmacy-category ${sortOrder === "az" ? "active" : ""}`}
            onClick={() => setSortOrder("az")}
          >
            A–Z
          </button>

          <button
            type="button"
            className={`pharmacy-category ${sortOrder === "za" ? "active" : ""}`}
            onClick={() => setSortOrder("za")}
          >
            Z–A
          </button>

        </div>


        {/* ================= HEADING ================= */}

        <div className="pharmacy-heading">

          <div>
            <h2>Healthcare Products</h2>
            <p>
              Product recommendations are neutral and are not
              tied to a specific pharmacy company.
            </p>
          </div>

          <span>{filteredProducts.length} products</span>

        </div>


        {/* ================= STAMP LEGEND ================= */}

        <div className="stamp-legend">
          <span className="stamp-legend-item">
            <span className="stamp-legend-dot stamp-legend-dot--medicine" />
            MED — Generic medicine
          </span>

          <span className="stamp-legend-item">
            <span className="stamp-legend-dot stamp-legend-dot--supplement" />
            SUP — Health supplement
          </span>

          <span className="stamp-legend-item">
            <span className="stamp-legend-dot stamp-legend-dot--health-device" />
            DEV — Health device
          </span>

          <span className="stamp-legend-item">
            <span className="stamp-legend-dot stamp-legend-dot--general-health-product" />
            OTC — Over-the-counter product
          </span>
        </div>


        {/* ================= PRODUCT GRID ================= */}

        <div className="product-grid">

          {filteredProducts.length > 0 ? (

            filteredProducts.map((product) => {
              const CategoryIcon = categoryIcons[product.category] || IconCapsule;

              const typeLabel =
                product.type === "medicine"
                  ? "Generic medicine"
                  : product.type === "supplement"
                  ? "Health supplement"
                  : product.type === "health-device"
                  ? "Health device"
                  : "Generic product";

              const sourceLabel = "Multiple sources";

              // short "stamped" badge — reads like a rubber-stamped
              // ticket mark showing product type at a glance
              const stampText =
                product.type === "medicine"
                  ? "MED"
                  : product.type === "supplement"
                  ? "SUP"
                  : product.type === "health-device"
                  ? "DEV"
                  : "OTC";

              return (
                <article className="product-card" key={product.id}>

                  <span className={`product-stamp product-stamp--${product.type}`}>
                    {stampText}
                  </span>

                  <div className="product-image">
                    <span className="product-image-icon">
                      <CategoryIcon size={30} />
                    </span>
                  </div>

                  <div className="product-info">

                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <p>{product.description}</p>

                    <div className="product-tags">
                      {(product.keywords || [])
                        .slice(0, 4)
                        .map((keyword) => (
                          <span key={keyword}>{keyword}</span>
                        ))}
                    </div>

                    <div className="product-footer">

                      <div className="product-footer-meta">
                        <small>{typeLabel}</small>
                        <strong>{sourceLabel}</strong>
                      </div>

                      <a
                        href={getMedkartUrl(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Find Available Options →
                      </a>

                    </div>

                  </div>

                </article>
              );
            })

          ) : (

            <div className="no-products">

              <div className="no-products-icon">
                <IconSearch size={22} />
              </div>

              <h3>No matching products found</h3>

              <p>Try another keyword such as:</p>

              <div className="suggested-searches">
                <span>periods</span>
                <span>rash</span>
                <span>face wash</span>
                <span>cleanser</span>
                <span>thermometer</span>
                <span>first aid</span>
              </div>

            </div>

          )}

        </div>

      </main>


      {/* ================= DISCLAIMER ================= */}

      <div className="pharmacy-disclaimer">
        <strong>
          <IconInfo size={16} />
          Medical Information Notice
        </strong>
        <p>
          This information is provided for educational purposes
          and does not replace professional medical advice,
          diagnosis, or treatment. Seek advice from a qualified
          healthcare professional for personal medical concerns.
        </p>
      </div>

    </div>
  );
}