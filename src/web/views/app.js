const componentNames = {
  FRAME: "Frame",
  HANDLEBAR_BRAKES: "Handle Bar/Brakes",
  SEATING: "Seating",
  WHEELS: "Wheels",
  CHAIN_ASSEMBLY: "Chain Assembly",
};

const MAX_QUANTITY = 999;
const MAX_TOTAL_PARTS = 10000;

let allParts = {};
let selectedParts = {};
let currentComponent = "FRAME";
let currentDate = "2016-12-15";
let lastValidation = null;

// Compatibility rules
const compatibilityRules = {
  tubeless_tyre: {
    incompatible: ["tube"],
    message:
      "⚠️ Tubeless Tyre cannot be used with Inner Tube. Remove the tube for tubeless setup.",
  },
  tube: {
    incompatible: ["tubeless_tyre"],
    message:
      "⚠️ Inner Tube is not compatible with Tubeless Tyre. Use standard tyre instead.",
  },
};

async function loadParts() {
  try {
    const response = await fetch("/api/parts");
    allParts = await response.json();
    renderParts(currentComponent);
  } catch (error) {
    console.error("Error loading parts:", error);
  }
}

async function getPriceForPart(partId, date) {
  try {
    const response = await fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, parts: [partId] }),
    });

    const result = await response.json();
    if (response.ok && result.details && result.details.length > 0) {
      return result.details[0].price;
    }
  } catch (error) {
    console.error("Error fetching price:", error);
  }
  return 0;
}

async function validateConfiguration(partIds) {
  try {
    const response = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ parts: partIds }),
    });

    const result = await response.json();
    lastValidation = result;
    return result;
  } catch (error) {
    console.error("Error validating:", error);
    return { isValid: false, errors: [], warnings: [], suggestions: [] };
  }
}

function getCompatibilityWarnings() {
  if (!lastValidation) return [];

  const allMessages = [];

  // Add errors
  if (lastValidation.errors && lastValidation.errors.length > 0) {
    lastValidation.errors.forEach((error) => {
      allMessages.push({
        type: "error",
        message: error,
        severity: "error",
      });
    });
  }

  // Add warnings
  if (lastValidation.warnings && lastValidation.warnings.length > 0) {
    lastValidation.warnings.forEach((warning) => {
      allMessages.push({
        type: "warning",
        message: warning,
        severity: "warning",
      });
    });
  }

  return allMessages;
}

function displayCompatibilityWarnings() {
  const warningsContainer = document.getElementById(
    "compatibilityWarningsContainer",
  );
  if (!warningsContainer) return;

  const messages = getCompatibilityWarnings();
  warningsContainer.innerHTML = "";

  if (messages.length > 0) {
    messages.forEach((msg) => {
      const warningDiv = document.createElement("div");
      warningDiv.className = `compatibility-warning severity-${msg.severity}`;
      // Remove the warning icon from message text since CSS will add it
      const cleanMessage = msg.message
        .replace(/^⚠️\s*/, "")
        .replace(/^❌\s*/, "");
      warningDiv.textContent = cleanMessage;
      warningsContainer.appendChild(warningDiv);
    });
    warningsContainer.style.display = "block";
  } else {
    warningsContainer.style.display = "none";
  }
}

function renderParts(component) {
  const container = document.getElementById("partsContainer");
  container.innerHTML = "";

  const parts = allParts[component] || [];
  currentDate = document.getElementById("pricingDate").value;

  parts.forEach((part) => {
    const div = document.createElement("div");
    div.className = "part-option-group";
    div.id = `part-group-${part.id}`;

    const checkboxDiv = document.createElement("div");
    checkboxDiv.className = "part-option";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.name = component;
    input.value = part.id;
    input.id = part.id;

    if (selectedParts[part.id] && selectedParts[part.id] > 0) {
      input.checked = true;
    }

    input.addEventListener("change", (e) => {
      if (e.target.checked) {
        if (!selectedParts[part.id]) {
          selectedParts[part.id] = 1;
        }
      } else {
        delete selectedParts[part.id];
      }
      updateQuantityControls(part.id);
      checkAndDisplayValidation();
    });

    const label = document.createElement("label");
    label.htmlFor = part.id;
    label.className = "part-label";

    const labelContent = document.createElement("div");
    labelContent.className = "part-label-content";

    const partNameSpan = document.createElement("span");
    partNameSpan.className = "part-name";
    partNameSpan.textContent = part.name;

    const priceSpan = document.createElement("span");
    priceSpan.className = "part-price";
    priceSpan.id = `price-${part.id}`;
    priceSpan.textContent = "Loading...";

    labelContent.appendChild(partNameSpan);
    labelContent.appendChild(priceSpan);
    label.appendChild(labelContent);

    checkboxDiv.appendChild(input);
    checkboxDiv.appendChild(label);
    div.appendChild(checkboxDiv);

    const quantityDiv = document.createElement("div");
    quantityDiv.className = "quantity-controls";

    const decreaseBtn = document.createElement("button");
    decreaseBtn.className = "qty-btn qty-btn-minus";
    decreaseBtn.textContent = "−";
    decreaseBtn.disabled = !input.checked;
    decreaseBtn.type = "button";
    decreaseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (selectedParts[part.id] && selectedParts[part.id] > 1) {
        selectedParts[part.id]--;
        updateQuantityDisplay(part.id);
        checkAndDisplayValidation();
      }
    });

    const quantityDisplay = document.createElement("span");
    quantityDisplay.className = "quantity-display";
    quantityDisplay.id = `qty-display-${part.id}`;
    quantityDisplay.textContent = selectedParts[part.id] || 1;

    const increaseBtn = document.createElement("button");
    increaseBtn.className = "qty-btn qty-btn-plus";
    increaseBtn.textContent = "+";
    increaseBtn.disabled = !input.checked;
    increaseBtn.type = "button";
    increaseBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (selectedParts[part.id] < MAX_QUANTITY) {
        selectedParts[part.id]++;
        updateQuantityDisplay(part.id);
        checkAndDisplayValidation();
      } else {
        showQuantityWarning(part.name, MAX_QUANTITY);
      }
    });

    quantityDiv.appendChild(decreaseBtn);
    quantityDiv.appendChild(quantityDisplay);
    quantityDiv.appendChild(increaseBtn);
    div.appendChild(quantityDiv);

    container.appendChild(div);

    // Fetch and display price asynchronously
    fetchAndDisplayPrice(part.id);
  });

  displayCompatibilityWarnings(); // Show warnings after rendering
}

// Fetch price for each part
async function fetchAndDisplayPrice(partId) {
  const date = document.getElementById("pricingDate").value;
  const price = await getPriceForPart(partId, date);
  const priceElement = document.getElementById(`price-${partId}`);
  if (priceElement) {
    priceElement.textContent = `₹${price.toLocaleString("en-IN")}`;
  }
}

function updateQuantityDisplay(partId) {
  const display = document.getElementById(`qty-display-${partId}`);
  if (display) {
    display.textContent = selectedParts[partId] || 1;
  }
}

function updateQuantityControls(partId) {
  const partGroup = document.getElementById(`part-group-${partId}`);
  if (!partGroup) return;

  const decreaseBtn = partGroup.querySelector(".qty-btn-minus");
  const increaseBtn = partGroup.querySelector(".qty-btn-plus");
  const checkbox = document.getElementById(partId);
  const isChecked = checkbox && checkbox.checked;

  if (decreaseBtn) decreaseBtn.disabled = !isChecked;
  if (increaseBtn) increaseBtn.disabled = !isChecked;

  // Ensure selectedParts is initialized
  if (isChecked && !selectedParts[partId]) {
    selectedParts[partId] = 1;
  }

  updateQuantityDisplay(partId);
}

async function checkAndDisplayValidation() {
  const selectedPartIds = Object.keys(selectedParts).filter(
    (id) => selectedParts[id] > 0,
  );

  if (selectedPartIds.length > 0) {
    const validation = await validateConfiguration(selectedPartIds);
    displayCompatibilityWarnings();
  } else {
    const warningsContainer = document.getElementById(
      "compatibilityWarningsContainer",
    );
    if (warningsContainer) {
      warningsContainer.innerHTML = "";
      warningsContainer.style.display = "none";
    }
    lastValidation = null;
  }
}

function showQuantityWarning(partName, maxQty) {
  const message = `⚠️ Quantity Limit Exceeded!\n\nMaximum allowed quantity per item: ${maxQty}\n\nYou have reached the limit.`;
  alert(message);
}

function validateTotalParts() {
  let totalParts = 0;
  Object.values(selectedParts).forEach((qty) => {
    totalParts += qty;
  });

  if (totalParts > MAX_TOTAL_PARTS) {
    const message = `⚠️ Total Parts Limit Exceeded!\n\nMaximum total parts allowed: ${MAX_TOTAL_PARTS}\nYou have selected: ${totalParts} parts\n\nPlease reduce the quantity of selected items.`;
    alert(message);
    return false;
  }

  return true;
}

// Update prices when date changes
document.getElementById("pricingDate").addEventListener("change", () => {
  const component = currentComponent;
  renderParts(component);
});

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", (e) => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    e.target.classList.add("active");
    currentComponent = e.target.dataset.component;
    renderParts(currentComponent);
  });
});

document.getElementById("calculateBtn").addEventListener("click", async () => {
  const date = document.getElementById("pricingDate").value;

  const parts = [];
  Object.entries(selectedParts).forEach(([partId, quantity]) => {
    for (let i = 0; i < quantity; i++) {
      parts.push(partId);
    }
  });

  if (parts.length === 0) {
    alert("❌ Please select at least one part");
    return;
  }

  if (!validateTotalParts()) {
    return;
  }

  try {
    const response = await fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, parts }),
    });

    const result = await response.json();

    if (response.ok) {
      displayBreakdown(result);
    } else {
      // Show validation errors instead of generic error
      if (result.errors && result.errors.length > 0) {
        let errorMessage = "❌ INVALID COMBINATION:\n\n";
        errorMessage += result.errors.join("\n\n");

        if (result.suggestions && result.suggestions.length > 0) {
          errorMessage += "\n\n💡 SUGGESTIONS:\n";
          result.suggestions.forEach((suggestion) => {
            errorMessage += `• ${suggestion.fix}\n`;
          });
        }

        alert(errorMessage);
      } else {
        alert("❌ Error: " + result.error);
      }
    }
  } catch (error) {
    console.error("Error calculating price:", error);
    alert("❌ Failed to calculate price. Please try again.");
  }
});

document.getElementById("resetBtn").addEventListener("click", () => {
  selectedParts = {};
  lastValidation = null;

  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });

  document.querySelectorAll(".qty-btn").forEach((btn) => {
    btn.disabled = true;
  });

  document.querySelectorAll(".quantity-display").forEach((display) => {
    display.textContent = 1;
  });

  const warningsContainer = document.getElementById(
    "compatibilityWarningsContainer",
  );
  if (warningsContainer) {
    warningsContainer.innerHTML = "";
    warningsContainer.style.display = "none";
  }

  const container = document.getElementById("breakdownContainer");
  container.innerHTML = "";
  const placeholder = document.createElement("p");
  placeholder.className = "placeholder";
  placeholder.textContent = "Select parts and click Calculate";
  container.appendChild(placeholder);

  console.log("✓ All selections reset");
});

function displayBreakdown(result) {
  const container = document.getElementById("breakdownContainer");
  container.innerHTML = "";

  const sortedComponents = [
    "FRAME",
    "HANDLEBAR_BRAKES",
    "SEATING",
    "WHEELS",
    "CHAIN_ASSEMBLY",
  ];

  sortedComponents.forEach((component) => {
    const items = result.details.filter((b) => b.component === component);

    if (items.length > 0) {
      const componentDiv = document.createElement("div");
      componentDiv.className = "breakdown-section-header";
      componentDiv.innerHTML = `<strong>${componentNames[component]}</strong>`;
      container.appendChild(componentDiv);

      items.forEach((item) => {
        const div = document.createElement("div");
        div.className = "breakdown-item";

        let priceDisplay = `₹${item.price.toLocaleString("en-IN")}`;
        if (item.quantity > 1) {
          priceDisplay = `${item.quantity}x ₹${item.price.toLocaleString("en-IN")} = ₹${item.totalPrice.toLocaleString("en-IN")}`;
        } else {
          priceDisplay = `₹${item.totalPrice.toLocaleString("en-IN")}`;
        }

        div.innerHTML = `
          <span class="breakdown-item-label">  └─ ${item.partName}</span>
          <span class="breakdown-item-price">${priceDisplay}</span>
        `;
        container.appendChild(div);
      });

      const componentTotal = items.reduce(
        (sum, item) => sum + item.totalPrice,
        0,
      );
      const subtotalDiv = document.createElement("div");
      subtotalDiv.className = "breakdown-subtotal";
      subtotalDiv.innerHTML = `
        <span>${componentNames[component]} Subtotal</span>
        <span>₹${componentTotal.toLocaleString("en-IN")}</span>
      `;
      container.appendChild(subtotalDiv);
    }
  });

  const totalDiv = document.createElement("div");
  totalDiv.className = "total-price";
  totalDiv.innerHTML = `
    <span>TOTAL</span>
    <span>₹${result.totalPrice.toLocaleString("en-IN")}</span>
  `;
  container.appendChild(totalDiv);

  if (result.warnings && result.warnings.length > 0) {
    const warningDiv = document.createElement("div");
    warningDiv.className = "warning";
    warningDiv.innerHTML =
      "⚠️ " + result.warnings.map((w) => `<div>${w}</div>`).join("");
    container.appendChild(warningDiv);
  }
}

loadParts();
