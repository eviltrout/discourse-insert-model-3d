import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { getOwner } from "@ember/owner";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import ConditionalLoadingSpinner from "discourse/components/conditional-loading-spinner";
import UppyUpload from "discourse/lib/uppy/uppy-upload";
import icon from "discourse-common/helpers/d-icon";

export default class ModelUploader extends Component {
  @tracked model3D;

  uppyUpload = new UppyUpload(getOwner(this), {
    type: "model3d",
    id: "model-3d-uploader",
    uploadDone: ({ url }) => {
      this.model3D = url;
      this.args.setModel3D(url);
    },
  });

  get addDisabled() {
    return this.uppyUpload.uploading;
  }

  @action
  updateModel3D(event) {
    this.model3D = event.target.value;
    this.args.setModel3D(this.model3D);
  }

  <template>
    <div class="model-3d-uploader">
      <input
        type="text"
        name="model-3d"
        value={{this.model3D}}
        {{on "input" this.updateModel3D}}
      />

      <div class="simple-list-uploader">
        <label class="btn {{if this.addDisabled 'disabled'}}">
          {{icon "upload"}}
          <input
            {{didInsert this.uppyUpload.setup}}
            class="hidden-upload-field"
            type="file"
            disabled={{this.addDisabled}}
            accept="model/gltf-binary,model/gltf+json"
          />
        </label>
        <ConditionalLoadingSpinner @condition={{this.addDisabled}} />
      </div>
    </div>
  </template>
}
