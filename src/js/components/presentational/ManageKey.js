import React, { Component } from "react";
import Clipboard from 'react-clipboard.js';

class ManageKey extends Component {
  render() {
    return (
      <div>
        <button onClick={this.props.destroyKey}>
          Destroy
        </button>
        <br />
        <button onClick={this.props.regenerateKey}>
          Regenerate
        </button>
        <Clipboard option-text={this.props.getKey} onSuccess={this.props.handleSuccessfulClipboardCopy}>
          copy to clipboard
        </Clipboard>
      </div>
    )
  }
}
export default ManageKey;
