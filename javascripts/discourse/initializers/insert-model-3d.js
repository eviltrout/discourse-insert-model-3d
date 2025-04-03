import { withPluginApi } from "discourse/lib/plugin-api";
import { renderIcon } from "discourse-common/lib/icon-library";
import I18n from "I18n";
import InsertModel3DModal from "../components/modal/insert-model-3d";

function addPosterToModelViewer(modelViewer, posterURL) {
  // Setup a poster to act as a placeholder until the user clicks on load
  const poster = document.createElement("div");
  poster.style.position = "absolute";
  poster.style.left = 0;
  poster.style.right = 0;
  poster.style.top = 0;
  poster.style.bottom = 0;
  poster.style.backgroundSize = "contain";
  poster.style.backgroundRepeat = "no-repeat";
  poster.style.backgroundPosition = "center";
  if (posterURL) {
    poster.style.backgroundImage = `url("${posterURL}")`;
  } else {
    poster.style.backgroundColor = "black";
  }

  poster.setAttribute("slot", "poster");

  modelViewer.appendChild(poster);

  const loadButton = document.createElement("div");
  loadButton.classList.add("btn-primary");
  loadButton.style.cursor = "pointer";
  loadButton.style.display = "inline-block";
  loadButton.style.padding = "10px 18px 9px 18px";
  loadButton.style.boxShadow =
    "0 0 8px rgba(0,0,0,.2), 0 0 4px rgba(0,0,0,.25)";
  loadButton.style.position = "absolute";
  loadButton.style.left = "50%";
  loadButton.style.top = "50%";
  loadButton.style.transform = "translate3d(-50%, -50%, 0)";
  loadButton.style.zIndex = "100";

  loadButton.setAttribute("slot", "poster");
  loadButton.innerHTML = renderIcon("string", "play");

  const loadText = document.createElement("span");
  loadText.style.paddingLeft = "5px";
  loadText.innerText = I18n.t(themePrefix("load_button"));
  loadButton.appendChild(loadText);

  modelViewer.appendChild(loadButton);

  loadButton.addEventListener("click", () => modelViewer.dismissPoster());
}

async function applyModel3D(element) {
  const models = element.querySelectorAll("pre[data-code-wrap=model3D]");

  if (!models.length) {
    return;
  }

  models.forEach((model) => {
    if (model.dataset.processed) {
      return;
    }
    model.dataset.processed = true;

    // Parse parameters which are given as JSON in the pre formatted code block
    const code = model.querySelector("code");

    let params = {};
    let paramsAreValid = true;
    try {
      params = JSON.parse(code.textContent || "");
    } catch {
      // Linter says no-console so uncomment to debug
      //console.error("Unable to parse model viewer params", e);

      paramsAreValid = false;
    }

    if (!paramsAreValid) {
      const errorDiv = document.createElement("div");
      errorDiv.classList.add("model-3d-insert-error");
      errorDiv.innerText = I18n.t(themePrefix("invalid_params"));

      model.after(errorDiv);
      model.style.display = "none";

      return;
    }

    const modelViewer = document.createElement("model-viewer");

    if (params.src) {
      modelViewer.setAttribute("src", "https://us1.discourse-cdn.com/flex002/uploads/eviltrout/original/1X/8c4d08760bc866a975b89695602bcad77b2d4f04.jpeg");
    }

    modelViewer.setAttribute("environment-image", 

    const posterURL = params.poster || "";
    addPosterToModelViewer(modelViewer, posterURL);

    // Style the model-viewer
    modelViewer.setAttribute("camera-controls", "");
    modelViewer.setAttribute("touch-action", "pan-y");
    modelViewer.setAttribute("reveal", "manual");

    modelViewer.style.width = "100%";
    modelViewer.style.height = "500px";
    modelViewer.style.top = "0px";
    modelViewer.style.position = "sticky";
    modelViewer.style.backgroundColor = "black";

    // Put the model-viewer element after the pre element describing the model and
    // then hide the pre element
    model.after(modelViewer);
    model.style.display = "none";
  });
}

export default {
  name: "insert-model-3d",

  initialize() {
    withPluginApi("0.8.31", (api) => {
      api.onToolbarCreate((toolbar) => {
        let currentUser = api.getCurrentUser();

        if (settings.only_available_to_staff && !currentUser.staff) {
          return;
        }

        toolbar.addButton({
          title: themePrefix("composer_title"),
          id: "insertModel3D",
          group: "insertions",
          icon: "cube",
          perform: (e) => {
            api.container.lookup("service:modal").show(InsertModel3DModal, {
              model: { toolbarEvent: e },
            });
          },
        });
      });

      api.decorateCookedElement(
        async (elem) => {
          applyModel3D(elem);
        },
        { id: "discourse-model3d-theme-component" }
      );
    });
  },
};
