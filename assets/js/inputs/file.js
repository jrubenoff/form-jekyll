const sanitizeFileName = () => {
  const fileInputs = document.querySelectorAll(`input[type="file"]`);

  fileInputs.forEach(input => {
    input.addEventListener('change', (e) => {
      const plainFilename = input.value.replace(/C:\\fakepath\\/i, '');
      input.nextElementSibling.dataset.filename = plainFilename;
    });
  });
}

export default sanitizeFileName;