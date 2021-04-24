const imgForm = document.getElementById('image-form');
const imgGrid = document.querySelector('.image-grid');
let files;

const submitImage = async () => {
  const formData = new FormData();

  formData.append('file', files);

  const resp = await fetch('/upload', {
    method: 'POST',
    body: formData,
  });
  const fileUrls = await resp.json();
  imgGrid.innerHTML = fileUrls
    .map(
      (url) => `
    <img src="${url}" />
  `
    )
    .join('');
};

imgForm.file.addEventListener('change', (event) => {
  files = event.target.files[0];
});

imgForm.addEventListener('submit', (event) => {
  event.preventDefault();
  submitImage();
});
