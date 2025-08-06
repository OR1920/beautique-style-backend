
function matchMakeup(){
  const fileInput = document.getElementById('imageUpload');
  const eventSel = document.getElementById('eventSelect');
  const results = document.getElementById('results');
  const cardsContainer = document.querySelector('.cards');
  if(!fileInput.files.length){
    alert('Please choose an image first.');
    return;
  }
  if(!eventSel.value){
    alert('Please select an event type.');
    return;
  }
  // Clear old cards
  cardsContainer.innerHTML = '';
  const reader = new FileReader();
  reader.onload = function(e){
    const imgSrc = e.target.result;
    // Generate 3 look cards dynamically
    const looks = [
      {title:'Glam Glow',desc:'Radiant skin, glitter lids & glossy lips – perfect for parties.'},
      {title:'Soft Matte',desc:'Subtle contour, matte eyes & nude lips for an elegant interview.'},
      {title:'Romantic Rose',desc:'Blush tones & soft shimmer – ideal for dates or weddings.'}
    ];
    looks.forEach(l=>{
      const card = document.createElement('div');
      card.className='card';
      card.innerHTML = `
        <img src="${imgSrc}" alt="${l.title}"/>
        <h4>${l.title}</h4>
        <p>${l.desc}</p>
      `;
      card.onclick = ()=>{window.open(imgSrc,'_blank');};
      cardsContainer.appendChild(card);
    });
    results.classList.remove('hidden');
    results.scrollIntoView({behavior:'smooth'});
  };
  reader.readAsDataURL(fileInput.files[0]);
}
