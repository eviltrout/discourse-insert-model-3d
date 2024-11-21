import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { empty } from "@ember/object/computed";
import { service } from "@ember/service";
import I18n from "I18n";

function isModel3D(path) {
  return /\.(gltf|glb)$/i.test(path);
}

export default class InsertModel3DModal extends Component {
  @service appEvents;

  @tracked model3D;
  @tracked poster;
  @empty("model3D") insertDisabled;

  _keyDown(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  @action
  async preventSubmitOnEnter(modal) {
    // prevent submitting on enter while adding items using Enter
    modal
      .querySelector(".model-3d-sources")
      .addEventListener("keydown", this._keyDown);
  }

  get sourceList() {
    if (!this.sources) {
      return [];
    }

    return this.sources.split("|");
  }

  get validationMessage() {
    return isModel3D(this.model3D) ? "" : I18n.t(themePrefix("source_not_model_3d"));
  }

  _sourceType(src) {
    let prefix = "model"
    let type = "";

    if (src.endsWith(".glb")) {
      type = "gltf-binary";
    } else {
      type = "gltf+ascii";
    }

    return `${prefix}/${type}`;
  }

  @action
  insertModel3D() {


    const poster = this.poster ? ` poster="${this.poster}"` : "";
    const text = `<model-viewer src="${this.model3D}" ${poster} camera-controls touch-action="pan-y"></model-viewer>`;

    this.args.model.toolbarEvent.addText(text);
    this.appEvents.trigger("discourse-insert-model-3d:model-3d-inserted", text);
    this.args.closeModal();
  }

  @action
  setPoster(val) {
    this.poster = val;
  }
}
