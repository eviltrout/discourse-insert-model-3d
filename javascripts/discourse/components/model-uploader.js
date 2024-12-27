import Component from "@ember/component";
import { action } from "@ember/object";
import { alias } from "@ember/object/computed";
import UppyUploadMixin from "discourse/mixins/uppy-upload";

export default Component.extend(UppyUploadMixin, {
  type: "model3d",
  addDisabled: alias("uploading"),
  classNameBindings: [":model-3d-uploader"],
  uploadDone({ url }) {
    this.set("model3d", url);
    this.setModel3D(url);
  },

  @action
  updateModel3D(event) {
    this.set("model3d", event.target.value);
    this.setModel3D(this.model3d);
  },
});
