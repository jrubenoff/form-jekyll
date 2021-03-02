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

const radioButtons = document.querySelectorAll(`input[type='radio']`);
const conditionalInputs = document.querySelectorAll('input[data-if]');
const conditionalCheckboxes = document.querySelectorAll(`input[type='checkbox'][data-shows]`);


const conditionals = () => {
  // Toggling radio buttons
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
};

export default conditionals;