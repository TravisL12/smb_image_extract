const imgForm = document.getElementById("image-form");
const imgGrid = document.querySelector(".image-grid");
const uploadContainer = document.querySelector(".image-upload");
let files;

const submitImage = async () => {
  const formData = new FormData();

  formData.append("file", files);

  const resp = await fetch("upload", {
    method: "POST",
    body: formData,
  });
  const fileUrls = await resp.json();
  imgGrid.innerHTML = fileUrls
    .map(
      (url) => /* html */ `
      <div class='player-image'>
        <img title="${url}" src="${url}" />
      </div>`
    )
    .join("");
  downloadListener();
};

const downloadListener = () => {
  const imgEl = document.querySelectorAll(".player-image img");
  for (let i in imgEl) {
    const img = imgEl[i];
    if (typeof img === "object") {
      img.addEventListener("click", (event) => {
        downloadOnClick(event.target);
      });
    }
  }
};

const downloadOnClick = async (imageObj) => {
  const image = await fetch(imageObj.src);
  const imageBlog = await image.blob();
  const imageURL = URL.createObjectURL(imageBlog);

  const link = document.createElement("a");
  link.href = imageURL;
  link.download = imageObj.title;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

imgForm.file.addEventListener("change", (event) => {
  files = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const imgContainer = document.createElement("div");
    imgContainer.classList = "uploadContainer";
    const img = document.createElement("img");
    img.src = e.target.result;
    imgContainer.append(img);
    uploadContainer.append(imgContainer);
  };
  reader.readAsDataURL(files);
});

imgForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitImage();
});
