import React from 'react';
import { ipcRenderer } from 'electron';

const withWebviewIPC = (Component) => {
  return class ComponentWithWebviewIPC extends React.PureComponent {
    render() {
      return <Component {...this.props} onFocus={this.handleFocus} />;
    }

    handleFocus = (id) => {
      ipcRenderer.send('webview:focus', id);
    }
  };
};

export default withWebviewIPC;
