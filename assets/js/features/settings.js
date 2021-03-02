// --- Settings checkboxes ---

const settings = () => {
  Mousetrap.bind(['command+alt+.', 'ctrl+alt+.'], function(e) {
    document.body.classList.toggle('admin');
  });

  const settingsList = ['all-pages', 'all-conditionals', 'all-annotations', 'show-hidden', 'top-nav'];

  // Initialize checkboxes
  const settingEnable = setting => {
    // Set initial state
    // (Firefox doesn't clear page classes on reload)
    const checkbox = document.querySelector(`#settings-${setting}`);

    checkbox.checked === document.body.classList.contains(setting) ? true : false;

    // Add / remove <body> classes
    checkbox.addEventListener('change', (e) => {
      document.body.classList.toggle(setting);
    });
  };


  for (let s = 0; s < settingsList.length; s++) {
    settingEnable(settingsList[s]);
  }

  // Show / hide settings modal
  const toggle = document.querySelector('.form-settings-toggle');

  toggle.addEventListener('click', (e) => {
    const formSettings = document.querySelector('.form-settings');
    formSettings.classList.toggle('active');
  });
};

export default settings;