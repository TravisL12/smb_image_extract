const imgForm = document.getElementById('image-form');
let files;

const submitImage = async () => {
  const formData = new FormData();

  formData.append('file', files);

  await fetch('/upload', {
    method: 'POST',
    body: formData,
  });
};

imgForm.file.addEventListener('change', (event) => {
  files = event.target.files[0];
});

imgForm.addEventListener('submit', (event) => {
  event.preventDefault();
  submitImage();
});
