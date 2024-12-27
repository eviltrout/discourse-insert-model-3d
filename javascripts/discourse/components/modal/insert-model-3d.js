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
      .querySelector(".model-3d-file")
      .addEventListener("keydown", this._keyDown);
  }

  get validationMessage() {
    if (!this.model3D) {
      return "";
    }

    return isModel3D(this.model3D)
      ? ""
      : I18n.t(themePrefix("source_not_model_3d"));
  }

  _sourceType(src) {
    let prefix = "model";
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
    let params = {
      src: this.model3D,
    };

    if (this.poster) {
      params.poster = this.poster;
    }

    let text = `\`\`\`model3D 
      ${JSON.stringify(params)}`;
    text += "\n```\n";

    // This is not great, but for now we need to include links to the uploaded assets so that
    // the server recognises that they should not be deleted.
    text += "<!-- PLEASE DON'T DELETE THESE LINKS -->\n";
    text += `<a href="${this.model3D}" style="display: none;" tabindex="-1"></a>\n`;

    if (this.poster) {
      text += `<a href="${this.poster}" style="display: none;" tabindex="-1"></a>\n`;
    }
    text += "<!-- PLEASE DON'T DELETE THESE LINKS -->\n";

    this.args.model.toolbarEvent.addText(text);
    this.appEvents.trigger("discourse-insert-model-3d:model-3d-inserted", text);
    this.args.closeModal();
  }

  @action
  setModel3D(val) {
    this.model3D = val;
  }

  @action
  setPoster(val) {
    this.poster = val;
  }
}
