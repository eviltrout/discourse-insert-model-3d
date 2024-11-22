import { withPluginApi } from "discourse/lib/plugin-api";
import InsertModel3DModal from "../components/modal/insert-model-3d";

async function applyModel3D(element, key = "composer") {
  const models = element.querySelectorAll("pre[data-code-wrap=model3D]");

  if (!models.length) {
    return;
  }

  models.forEach((model) => {
    if (model.dataset.processed) {
      return;
    }

    const modelViewer = document.createElement("model-viewer");
    const code = model.querySelector("code");

    try {
      const params = JSON.parse(code.textContent || "");
      modelViewer.setAttribute("src", params.src);
      if (params.poster) {
        modelViewer.setAttribute("poster", params.poster);
      }

      modelViewer.setAttribute("camera-controls", "");
      modelViewer.setAttribute("touch-action", "pan-y");

      modelViewer.style.width = "100%";
      modelViewer.style.height = "500px";
      modelViewer.style.top = "0px";
      modelViewer.style.position = "sticky";
      modelViewer.style.backgroundColor = "black";
    } catch (e) {
      console.log("Unable to parse model viewer params", e);
    }

    model.after(modelViewer);
    model.style.display = "none";
    model.dataset.processed = true;
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
        async (elem, helper) => {
          const id = helper ? `post_${helper.getModel().id}` : "composer";
          applyModel3D(elem, id);
        },
        { id: "discourse-model3d-theme-component" }
      );
    });
  },
};
