import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { on } from "@ember/modifier";
import { action } from "@ember/object";
import { getOwner } from "@ember/owner";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import ConditionalLoadingSpinner from "discourse/components/conditional-loading-spinner";
import UppyUpload from "discourse/lib/uppy/uppy-upload";
import icon from "discourse-common/helpers/d-icon";

export default class Model3DUploader extends Component {
  @tracked model3D;

  uppyUpload = new UppyUpload(getOwner(this), {
    type: "glb",
    id: "model-3d-uploader",

    uploadDone: ({ url }) => {
      this.model3D = url;
      this.args.setModel3D(url);
    },
  });

  get addDisabled() {
    return this.uppyUpload.uploading;
  }

  <template>
    <div class="simple-list-uploader">
      <label class="btn {{if this.addDisabled 'disabled'}}">
        {{icon "upload"}}
        <input
          {{didInsert this.uppyUpload.setup}}
          class="hidden-upload-field"
          disabled={{this.addDisabled}}
          type="file"
          accept="model/gltf-binary,model/gltf+json"
        />
      </label>
      <ConditionalLoadingSpinner @condition={{this.addDisabled}} />
    </div>
  </template>
}

