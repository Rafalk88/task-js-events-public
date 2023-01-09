const init = function() {
    const imagesList = document.querySelectorAll('.gallery__item');
    imagesList.forEach( img => {
        img.dataset.sliderGroupName = Math.random() > 0.5 ? 'nice' : 'good';
    }); // za każdym przeładowaniem strony przydzielaj inną nazwę grupy dla zdjęcia

    runJSSlider();
}

document.addEventListener('DOMContentLoaded', init);

const runJSSlider = function() {
    const imagesSelector = '.gallery__item';
    const sliderRootSelector = '.js-slider'; 

    const imagesList = document.querySelectorAll(imagesSelector);
    const sliderRootElement = document.querySelector(sliderRootSelector);

    initEvents(imagesList, sliderRootElement);
    initCustomEvents(imagesList, sliderRootElement, imagesSelector);
}

const initEvents = function (imagesList, sliderRootElement) {
  imagesList.forEach(function (item) {
    item.addEventListener("click", function (e) {
      fireCustomEvent(e.currentTarget, "js-slider-img-click");
    });
  });

  // todo:
  // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-next]
  // na elemencie [.js-slider__nav--next]
  const navNext = sliderRootElement.querySelector(".js-slider__nav--next");
  navNext.addEventListener("click", function () {
    fireCustomEvent(navNext, "js-slider-img-next");
  });

  // todo:
  // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-img-prev]
  // na elemencie [.js-slider__nav--prev]
  const navPrev = sliderRootElement.querySelector(".js-slider__nav--prev");
  navPrev.addEventListener("click", function () {
    fireCustomEvent(navPrev, "js-slider-img-prev");
  });

  // todo:
  // utwórz nasłuchiwanie eventu o nazwie [click], który ma uruchomić event [js-slider-close]
  // tylko wtedy, gdy użytkownik kliknie w [.js-slider__zoom]
  const zoom = sliderRootElement.querySelector(".js-slider__zoom");
  zoom.addEventListener("click", function (e) {
    if (e.target.classList.contains("js-slider_zoom")) {
      fireCustomEvent(zoom, "js-slider-close");
    }
  });
};

const fireCustomEvent = function (element, name) {
  const event = new CustomEvent(name, {
    bubbles: true,
  });

  element.dispatchEvent(event);
};

const initCustomEvents = function (
  imagesList,
  sliderRootElement,
  imagesSelector
) {
  imagesList.forEach(function (img) {
    img.addEventListener("js-slider-img-click", function (event) {
      onImageClick(event, sliderRootElement, imagesSelector);
    });
  });

  sliderRootElement.addEventListener("js-slider-img-next", onImageNext);
  sliderRootElement.addEventListener("js-slider-img-prev", onImagePrev);
  sliderRootElement.addEventListener("js-slider-close", onClose);
};

const onImageClick = function (event, sliderRootElement, imagesSelector) {
  // todo:
  // 1. dodać klasę [.js-slider--active], aby pokazać całą sekcję
  // 2. wyszukać ściężkę (atrybut [src]) do klikniętego elementu i wstawić do [.js-slider__image]
  // 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
  // 4. wyszukać wszystkie zdjęcia należące do danej grupy, które wykorzystasz do osadzenia w dolnym pasku
  // 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
  // 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany

  const sectionImagePath = sliderRootElement.querySelector(".js-slider__image");
  const eventImageSource = event.target
    .querySelector("img")
    .getAttribute("src");
  const figureGroupName = event.target.getAttribute("data-slider-group-name");
  const figuresList = document.querySelectorAll(imagesSelector);
  const images = [];

  sliderRootElement.classList.add("js-slider--active");

  sectionImagePath.setAttribute("src", eventImageSource);

  figuresList.forEach((figure) => {
    if (figure.getAttribute("data-slider-group-name") === figureGroupName) {
      images.push(figure.querySelector(".gallery__image"));
    }
  });

  images.forEach((image) => {
    const thumbsItemProto = document.querySelector(
      ".js-slider__thumbs-item--prototype"
    );
    const thumbsItem = thumbsItemProto.cloneNode(true);
    const thumbsItemImage = thumbsItem.querySelector("img");

    thumbsItem.classList.remove("js-slider__thumbs-item--prototype");
    thumbsItemImage.setAttribute("src", image.getAttribute("src"));

    thumbsItemProto.parentElement.appendChild(thumbsItem);

    if (thumbsItemImage.getAttribute("src") === eventImageSource) {
      thumbsItemImage.classList.add("js-slider__thumbs-image--current");
    }
  });
};

const onImageNext = function (event) {
  // console.log(this, "onImageNext");
  // [this] wskazuje na element [.js-slider]

  // todo:
  // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
  // 2. znaleźć element następny do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
  // 3. sprawdzić czy ten element istnieje - jeśli nie to [.nextElementSibling] zwróci [null]
  // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
  // 5. podmienić atrybut o nazwie [src] dla [.js-slider__image]

  const currentImage = this.querySelector(".js-slider__thumbs-image--current");
  const currentfigure = currentImage.parentElement;
  const nextFigureToCurrent = currentfigure && currentfigure.nextElementSibling;
  const nextImageToCurrent =
    nextFigureToCurrent && nextFigureToCurrent.querySelector("img");

  if (nextImageToCurrent) {
    this.querySelector(".js-slider__image").setAttribute(
      "src",
      nextImageToCurrent.getAttribute("src")
    );
    nextImageToCurrent.classList.add("js-slider__thumbs-image--current");
    currentImage.classList.remove("js-slider__thumbs-image--current");
  }
};

const onImagePrev = function (event) {
  // console.log(this, "onImagePrev");
  // [this] wskazuje na element [.js-slider]

  // todo:
  // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
  // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM dla [.js-slider__thumbs]
  // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
  // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
  // 5. podmienić atrybut [src] dla [.js-slider__image]

  const currentImage = this.querySelector(".js-slider__thumbs-image--current");
  const currentfigure = currentImage.parentElement;
  const prevFigureToCurrent =
    currentfigure && currentfigure.previousElementSibling;
  const prevImageToCurrent =
    prevFigureToCurrent && prevFigureToCurrent.querySelector("img");

  if (
    prevImageToCurrent &&
    !prevFigureToCurrent.classList.contains("js-slider__thumbs-item--prototype")
  ) {
    this.querySelector(".js-slider__image").setAttribute(
      "src",
      prevImageToCurrent.getAttribute("src")
    );
    prevImageToCurrent.classList.add("js-slider__thumbs-image--current");
    currentImage.classList.remove("js-slider__thumbs-image--current");
  }
};

const onClose = function (event) {
  // todo:
  // 1. należy usunać klasę [js-slider--active] dla [.js-slider]
  // 2. należy usunać wszystkie dzieci dla [.js-slider__thumbs] pomijając [.js-slider__thumbs-item--prototype]

  console.log(event);
};