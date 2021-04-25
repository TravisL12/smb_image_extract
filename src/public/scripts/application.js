const imgForm = document.getElementById('image-form');
const imgGrid = document.querySelector('.image-grid');
const uploadContainer = document.querySelector('.image-upload');
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
      <div class='player-image'>
    <img src="${url}" />
    </div>
  `
    )
    .join('');
};

imgForm.file.addEventListener('change', (event) => {
  files = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const imgContainer = document.createElement('div');
    imgContainer.classList = 'uploadContainer';
    const img = document.createElement('img');
    img.src = e.target.result;
    imgContainer.append(img);
    uploadContainer.append(imgContainer);
  };
  reader.readAsDataURL(files);
});

imgForm.addEventListener('submit', (event) => {
  event.preventDefault();
  submitImage();
});
