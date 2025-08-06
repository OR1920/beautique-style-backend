async function matchMakeup() {
  const fileInput = document.getElementById('imageUpload');
  const eventSel = document.getElementById('eventSelect');
  const results = document.getElementById('results');
  const cardsContainer = document.querySelector('.cards');

  if (!fileInput.files.length) {
    alert('Please choose an image first.');
    return;
  }

  if (!eventSel.value) {
    alert('Please select an event type.');
    return;
  }

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);
  formData.append("event", eventSel.value);
  formData.append("n_styles", 3);

  // שולחים לשרת שלך ב-Render
  const response = await fetch("https://beautique-style-backend.onrender.com/match", {
    method: "POST",
    body: formData
  });

  const data = await response.json(); // התשובה מכילה תמונות, כותרות והסברים

  // ניקוי קודם
  cardsContainer.innerHTML = '';

  data.forEach(look => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${look.url}" alt="${look.title}">
      <h4>${look.title}</h4>
      <p>${look.reason}</p>
    `;
    card.onclick = () => window.open(look.url, '_blank');
    cardsContainer.appendChild(card);
  });

  results.classList.remove('hidden');
  results.scrollIntoView({ behavior: 'smooth' });
}
