import { withPluginApi } from "discourse/lib/plugin-api";
import InsertModel3DModal from "../components/modal/insert-model-3d";

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

    });
  },
};
