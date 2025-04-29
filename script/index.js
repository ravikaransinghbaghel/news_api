const pageNumber = document.getElementById('pageNumber');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const nav_item = document.querySelectorAll('.nav-item');
const news_type = document.querySelector('.news-type');


let currentPage = 1;
let start = 0;
let limit = 8;
let categary = 'top';
let globalArticles = [];

nav_item.forEach((item) => {
  item.addEventListener('click', () => {
    // console.log('Clicked item index:', index);
    // console.log('value:', item.dataset.value);
    categary = item.dataset.value;
    currentPage = 1;
    start = 0;
    limit = 8;
    fetchData(currentPage, categary)
  })
})


function createCard(item, index) {
  return `
       <div
              class="card bg-white p-4 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105">
              <img src="${item.image_url}" alt="Card Image"
                  class="w-full h-48 object-cover mb-4 rounded-lg">
              <h3 class=" w-full text-lg font-semibold text-gray-800 overfloe-x-hidden">${item.title}</h3>
              <p class="text-gray-600 mb-4">${item.description}</p>
              <button
                  class="full-news-btn w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer" data-index="${index}">Learn
                  More</button>
          </div>
    `;
}


function showFullNews(item) {
  const fullNewsContainer = document.getElementById('full-news-container');
  fullNewsContainer.innerHTML = `
    <div class="w-full bg-white p-6 rounded-xl shadow-lg">
      <div class="flex flex-col lg:flex-row gap-7">
        <img src="${item.image_url || 'https://via.placeholder.com/400x200?text=No+Image'}"
             alt="Card Image"
             class="lg:w-[75%] lg:h-64 object-cover mb-4 rounded-lg">
        <div class="title">
          <h3 class="text-2xl font-semibold text-gray-800 mb-4">${item.title || 'No Title'}</h3>
          <div class="auth flex gap-5 text-sm text-gray-600">
            <span>👤 ${item.author || 'Unknown Author'}</span>
            <span>📅 ${item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : 'No Date'}</span>
          </div>
        </div>
      </div>
      <div class="content text-gray-700 mt-6 text-lg leading-relaxed">
        ${item.content || item.description || 'No content available.'}
      </div>
    </div>
  `;
  fullNewsContainer.classList.remove('hidden');
  fullNewsContainer.scrollIntoView({ behavior: 'smooth' });
}



async function fetchData(page, categary) {
  try {

    const response = await fetch(`https://newsdata.io/api/1/news?apikey=pub_82970d979a51bd670ff1229a01519c5d5df4d&country=in&language=en&category=${categary}`);
    const data = await response.json();
    const cardContainer = document.getElementById('card-container');
    console.log(data.results);

    cardContainer.innerHTML = "";
    // Limit to 8 cards max
    const limitedData = data.results.slice(start, limit);
    // console.log(limitedData.length);
    let globalArticles = [];
    
    globalArticles = limitedData;

    limitedData.forEach(item => {
      const cardHTML = createCard({
        image_url: item.image_url,
        title: item.title.slice(0, 40) + '...',
        description: item.description
          ? item.description.slice(0, 40) + '...'
          : 'No description available',
      });

      cardContainer.innerHTML += cardHTML;
    });

    pageNumber.textContent = `Page ${page}`;
    news_type.innerHTML = `${categary} news !! `

    document.querySelectorAll('.full-news-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.dataset.index;
        console.log(index);

        showFullNews(globalArticles[index]);
      });
    });
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    limit -= 8;
    start -= 9
    fetchData(currentPage, categary);
  }
});

nextBtn.addEventListener('click', () => {
  // if (data.articles.length > limit) {
  currentPage++;
  limit += 8;
  start += 9
  fetchData(currentPage, categary);
  // }
});


fetchData(currentPage, categary);

setInterval(() => fetchData(), 500 * 60)