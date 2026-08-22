import { useState } from "react";
import { products } from "../data/products";
import "../styles/Pharmacy.css";

function Pharmacy({ selectedSymptoms = [] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // If symptoms came from Symptom Analyzer,
  // show only related products initially.
  const [symptomFilterActive, setSymptomFilterActive] = useState(
    selectedSymptoms.length > 0
  );

  const categories = [
    "All",
    "Skin Care",
    "Cold & Allergy",
    "Digestive Health",
    "First Aid",
    "Health Devices",
  ];

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredProducts = products.filter((product) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText) ||
      product.description.toLowerCase().includes(searchText) ||
      product.symptoms.some((symptom) =>
        symptom.toLowerCase().includes(searchText)
      );

    const matchesCategory =
      category === "All" ||
      product.category === category;

    const matchesSymptoms =
      !symptomFilterActive ||
      selectedSymptoms.length === 0 ||
      product.symptoms.some((symptom) =>
        selectedSymptoms.some(
          (selected) =>
            symptom.toLowerCase() === selected.toLowerCase()
        )
      );

    return (
      matchesSearch &&
      matchesCategory &&
      matchesSymptoms
    );
  });

  // =====================================================
  // PRODUCT ICON
  // =====================================================

  const getProductIcon = (category) => {
    switch (category) {
      case "Skin Care":
        return "🧴";

      case "Cold & Allergy":
        return "🌿";

      case "Digestive Health":
        return "💧";

      case "First Aid":
        return "🩹";

      case "Health Devices":
        return "🌡️";

      default:
        return "✦";
    }
  };

  return (
    <div className="pharmacy-page-wrapper">

      {/* =================================================
          NAVBAR
      ================================================= */}

      


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="pharmacy-page">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="pharmacy-hero">

          <div className="pharmacy-badge">
            ✦ SAFESURF PHARMACY
          </div>

          <h1>
            Healthcare products,
            <br />
            made easier to find.
          </h1>

          <p>
            Explore healthcare and wellness products
            related to common symptoms and everyday needs.
          </p>

        </section>


        {/* =================================================
            PHARMACY CONTENT
        ================================================= */}

        <section className="pharmacy-content">

          {/* =================================================
              PERSONALIZED SYMPTOM MATCH
          ================================================= */}

          {selectedSymptoms.length > 0 &&
            symptomFilterActive && (

              <div className="symptom-match-banner">

                <div className="symptom-match-left">

                  <div className="symptom-match-icon">
                    ✦
                  </div>

                  <div>

                    <span className="symptom-match-label">
                      PERSONALIZED FOR YOU
                    </span>

                    <h3>
                      Products related to your symptoms
                    </h3>

                    <div className="matched-symptoms">

                      {selectedSymptoms.map((symptom) => (
                        <span key={symptom}>
                          ✓ {symptom}
                        </span>
                      ))}

                    </div>

                  </div>

                </div>


                <button
                  type="button"
                  className="view-all-products-btn"
                  onClick={() =>
                    setSymptomFilterActive(false)
                  }
                >
                  View All Products
                  <span>→</span>
                </button>

              </div>

            )}


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="pharmacy-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search products or symptoms..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* =================================================
              CATEGORIES
          ================================================= */}

          <div className="pharmacy-categories">

            {categories.map((item) => (

              <button
                type="button"
                key={item}
                className={
                  category === item
                    ? "pharmacy-category active"
                    : "pharmacy-category"
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>

            ))}

          </div>


          {/* =================================================
              HEADING
          ================================================= */}

          <div className="pharmacy-heading">

            <div>

              <h2>
                {symptomFilterActive &&
                selectedSymptoms.length > 0
                  ? "Recommended Products"
                  : "Healthcare Products"}
              </h2>

              <p>
                Browse products available through
                external pharmacy platforms.
              </p>

            </div>

            <span>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1
                ? "product"
                : "products"}
            </span>

          </div>


          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          <div className="product-grid">

            {filteredProducts.length > 0 ? (

              filteredProducts.map((product) => (

                <article
                  className="product-card"
                  key={product.id}
                >

                  {/* PRODUCT IMAGE */}

                  <div className="product-image">

                    <div className="product-image-icon">
                      {getProductIcon(product.category)}
                    </div>

                  </div>


                  {/* PRODUCT INFORMATION */}

                  <div className="product-info">

                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>
                      {product.name}
                    </h3>

                    <p>
                      {product.description}
                    </p>


                    {/* SYMPTOM TAGS */}

                    <div className="product-tags">

                      {product.symptoms
                        .slice(0, 3)
                        .map((symptom) => (

                          <span key={symptom}>
                            {symptom}
                          </span>

                        ))}

                    </div>


                    {/* PRODUCT FOOTER */}

                    <div className="product-footer">

                      <div>

                        <small>
                          Available through
                        </small>

                        <strong>
                          {product.pharmacy}
                        </strong>

                      </div>


                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Product →
                      </a>

                    </div>

                  </div>

                </article>

              ))

            ) : (

              <div className="no-products">

                <div className="no-products-icon">
                  ⌕
                </div>

                <h3>
                  No matching products
                </h3>

                <p>
                  Try another symptom, search term,
                  or category.
                </p>

              </div>

            )}

          </div>

        </section>


        {/* =================================================
            DISCLAIMER
        ================================================= */}

        <section className="pharmacy-disclaimer">

          <strong>
            ⚕ Important
          </strong>

          <p>
            SafeSurf does not sell, prescribe, or dispense
            medicines. Product information is provided for
            general informational purposes. Selecting a
            product does not mean it is medically appropriate
            for you. Always check the product information
            and consult a qualified healthcare professional
            when needed.
          </p>

        </section>

      </main>


      

    </div>
  );
}

export default Pharmacy;