function addItem() {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML = `
      <input type="text" placeholder="Description">
      <input type="number" placeholder="Qty" class="qty">
      <input type="number" placeholder="Rate" class="rate">
      <input type="number" placeholder="Amount" class="amount" readonly>
      <button class="remove-btn" onclick="removeItem(this)">Remove</button>
    `;
    document.getElementById("items-container").appendChild(row);
    
    // Add event listeners to new inputs
    const qtyInput = row.querySelector('.qty');
    const rateInput = row.querySelector('.rate');
    qtyInput.addEventListener('input', calculateTotals);
    rateInput.addEventListener('input', calculateTotals);
}

function removeItem(button) {
    button.parentElement.remove();
    calculateTotals(); // Recalculate after removal
}

function calculateTotals() {
    // Calculate items total
    let itemsTotal = 0;
    document.querySelectorAll('.item-row').forEach(row => {
        const qty = parseFloat(row.querySelector('.qty').value) || 0;
        const rate = parseFloat(row.querySelector('.rate').value) || 0;
        const amount = qty * rate;
        row.querySelector('.amount').value = amount.toFixed(2);
        itemsTotal += amount;
    });
    
    // Calculate transport charges
    const transportCharges = parseFloat(document.querySelector('input[id="transportCharges"]').value) || 0;
    
    // Calculate subtotal
    const subtotal = itemsTotal + transportCharges;
    document.getElementById('subtotal').value = subtotal.toFixed(2);
    
    // Calculate taxes (2.5% CGST and 2.5% SGST)
    const cgstAmount = subtotal * 0.025;
    const sgstAmount = subtotal * 0.025;
    document.getElementById('cgst').value = cgstAmount.toFixed(2);
    document.getElementById('sgst').value = sgstAmount.toFixed(2);
    
    // Calculate grand total
    const grandTotal = subtotal + cgstAmount + sgstAmount;
    document.getElementById('grandTotal').value = grandTotal.toFixed(2);
    

    var convertor = require('number-to-words');
    console.log(convertor.toWords(grandTotal));
    document.getElementById('amountWords').value = convertor.toWords(grandTotal);
}

function generateInvoice() {
    const data = {
    customerName: document.getElementById("customerName").value,
    customerAddress: document.getElementById("customerAddress").value,
    customerGSTIN: document.getElementById("customerGSTIN").value,
    items: [],
    transport: document.getElementById("transport").value,
    cgst: document.getElementById("cgst").value,
    sgst: document.getElementById("sgst").value,
    subtotal: document.getElementById("subtotalDisplay").innerText,
    cgstAmount: document.getElementById("cgstAmountDisplay").innerText,
    sgstAmount: document.getElementById("sgstAmountDisplay").innerText,
    grandTotal: document.getElementById("grandTotalDisplay").innerText,
    amountWords: document.getElementById("amountWords").value,
  };

  document.querySelectorAll("#items-container .item-row").forEach(row => {
    const inputs = row.querySelectorAll("input");
    data.items.push({
      date: inputs[0].value,
      description: inputs[1].value,
      qty: inputs[2].value,
      rate: inputs[3].value,
      amount: inputs[4].value,
    });
  });

  // Store in localStorage and redirect
  localStorage.setItem("invoiceData", JSON.stringify(data));
  window.location.href = "preview.html";
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Add event listener to transport charges
    //document.querySelector('input[placeholder="e.g. 5000"]').addEventListener('input', calculateTotals);
    
    // Add event listeners to existing items (if any)
    // document.querySelectorAll('.qty, .rate').forEach(input => {
    //     input.addEventListener('input', calculateTotals);
    // });
    
    // Add initial item
    addItem();
});


onload = function() {
  calculateTotals(); // Initial calculation on load

}