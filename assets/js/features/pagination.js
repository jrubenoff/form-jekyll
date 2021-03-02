// ---- Pagination ----

// Track the current page number
// (The first page is always shown on page load)
let activePageNum = 1;

const prevPage = document.querySelectorAll('.form-section-prev');
const nextPage = document.querySelectorAll('.form-section-next');


function paginate(el, count) {
  el.forEach(button => {
    button.addEventListener('click', function(e) {
      const activePage = document.querySelector(`.form-section:nth-child(${activePageNum})`);

      // Hide the current page
      activePage.classList.remove('active');

      // Go to the previous / next page
      activePageNum = activePageNum + count;

      function checkPage(number) {
        const activePage = document.querySelector(`.form-section:nth-child(${activePageNum})`);
        const isHidden = activePage.dataset.group && !activePage.classList.contains('is-conditionally-visible');
        console.log(activePageNum);
        // If we're conditionally hiding the activePage,
        // go to the previous / next one
        if (isHidden) {
          console.log('hidden');
          activePageNum = activePageNum + number;
          console.log(activePageNum);
          checkPage(number);
        } else {
          // If the page is visible, show it
          const newPage = document.querySelector(`.form-section:nth-child(${activePageNum})`);
          newPage.classList.add('active');

          // Scroll to the top of the page
          document.querySelector("#sfgov-header").scrollIntoView();
        }
      }

      checkPage(count);
      e.preventDefault();
    });
  });
}

const pagination = () => {
  paginate(prevPage, -1);
  paginate(nextPage, 1);
};

export default pagination;