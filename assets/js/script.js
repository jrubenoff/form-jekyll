//  ---- Initial state  ----

window.hypothesisConfig = function () {
  return {
    "theme": "clean"
  };
};

// Make the first page visible

const firstPage = document.querySelector('.form-section:first-child');
firstPage.classList.add('active');

// Initialize bootstrap-validator
$(".form").validator();

Mousetrap.bind(['command+alt+.', 'ctrl+alt+.'], function(e) {
  document.body.classList.toggle('admin');
});

// --- Settings checkboxes ---

const settingInit = setting => {
  // Set initial state
  // (Firefox doesn't clear page classes on reload)
  const checkbox = document.querySelector(`#settings-${setting}`);

  checkbox.checked === document.body.classList.contains(setting) ? true : false;

  // Add / remove <body> classes
  checkbox.addEventListener('change', (e) => {
    document.body.classList.toggle(setting);
  });
};

settingInit('all-pages');
settingInit('all-conditionals');
settingInit('all-annotations');
settingInit('show-hidden');
settingInit('top-nav');

// Show / hide settings modal
const toggle = document.querySelector('.form-settings-toggle');

toggle.addEventListener('click', (e) => {
  const formSettings = document.querySelector('.form-settings');
  formSettings.classList.toggle('active');
});

// ---- File inputs ---

const fileInputs = document.querySelectorAll(`input[type="file"]`);

fileInputs.forEach(input => {
  input.addEventListener('change', (e) => {
    const plainFilename = input.value.replace(/C:\\fakepath\\/i, '');
    input.nextElementSibling.dataset.filename = plainFilename;
  });
});

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

paginate(prevPage, -1);
paginate(nextPage, 1);

//  ---- Conditionals  ----

function showGroup(el) {
  el.classList.add('is-triggering');
  const { shows } = el.dataset;

  // Show the groups tied to this conditional
  const groups = document.querySelectorAll(`div[data-group='${shows}']`);

  groups.forEach(group => {
    group.classList.add('is-conditionally-visible');
    const clickableEls = group.querySelectorAll('input, select, button');
    clickableEls.forEach(el => {
      el.removeAttribute('tabindex');
    })
  });
}

function hideGroup(el) {
  const { shows } = el.dataset;
  // Get the groups tied to this conditional
  const groups = document.querySelectorAll(`div[data-group='${shows}']`);
  el.classList.remove('is-triggering');

  if (shows) {
    // Get the number of inputs currently
    // triggering this conditional
    const activeTriggers = document.querySelectorAll(`input.is-triggering[data-shows='${shows}']`).length;

    // If there are no other triggers,
    // hide the conditional
    groups.forEach(group => {
      if (activeTriggers === 0) {
        group.classList.remove('is-conditionally-visible');
        const clickableEls = group.querySelectorAll('input, select, button');
        clickableEls.forEach(el => {
          el.tabindex = "-1";
        })
      }
    });
  }
}

// Toggling radio buttons
const radioButtons = document.querySelectorAll(`input[type='radio']`);

radioButtons.forEach(radio => {
  radio.addEventListener('change', () => {
    const name = radio.name;
    const shows = radio.dataset.shows;

    // If the button triggers a conditional,
    // show the group
    if (shows) {
      showGroup(radio);
    }

    // If the interaction deselects another radio button,
    // make sure its conditional is hidden
    const otherRadios = document.querySelectorAll(`input[name="${name}"]:not([data-shows="${shows}"])`);
    otherRadios.forEach(radio => {
      hideGroup(radio);
    });

  })
})
// Toggling checkboxes
const conditionalCheckboxes = document.querySelectorAll(`input[type='checkbox'][data-shows]`);

conditionalCheckboxes.forEach(checkbox => {
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      showGroup(checkbox);
    } else {
      hideGroup(checkbox);
    }
  });
});

// Match text field values
const conditionalInputs = document.querySelectorAll('input[data-if]');

conditionalInputs.forEach(input => {
  input.addEventListener('input', (e) => {
    const input = e.currentTarget;
    const fullTrigger = input.dataset.if;
    const currentValue = input.value;
    const regex = "^[<>]";

    function showIf(equation) {
      if (currentValue === '' || equation === false) {
        hideGroup(input);
      } else {
        showGroup(input);
      }
    }


    // If the trigger begins with
    // an "<" or ">" symbol...
    if (fullTrigger.match(regex)) {

      // Separate the number from the "<" or ">" symbol
      const triggerNumber = parseInt(fullTrigger.substr(1));
      const triggerOperator = fullTrigger.charAt(0);

      if (triggerOperator === '<') {
        // "Less than" conditionals
        showIf(currentValue < triggerNumber);
      } else {
        // "Greater than" conditionals
        showIf(currentValue > triggerNumber);
      }
    // Otherwise, match the value exactly
    } else {
      showIf(currentValue === fullTrigger);
    }
  });
});