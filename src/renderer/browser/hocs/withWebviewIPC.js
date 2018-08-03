import React from 'react';
import { ipcRenderer } from 'electron';

const withWebviewIPC = (Component) => {
  return class ComponentWithWebviewIPC extends React.PureComponent {
    componentDidMount() {
      ipcRenderer.on('history:back', this.handleBack);
      ipcRenderer.on('history:forward', this.handleForward);
      ipcRenderer.on('view:reload', this.handleReload);
      ipcRenderer.on('view:stop', this.handleStop);
      ipcRenderer.on('view:devtools', this.handleDevTools);
    }

    componentWillUnmount() {
      ipcRenderer.off('history:back', this.handleBack);
      ipcRenderer.off('history:forward', this.handleForward);
      ipcRenderer.off('view:reload', this.handleReload);
      ipcRenderer.off('view:stop', this.handleStop);
      ipcRenderer.off('view:devtools', this.handleDevTools);
    }

    render() {
      return <Component ref={this.registerRef} {...this.props} />;
    }

    handleBack = () => {
      this.component.goBack();
    }

    handleForward = () => {
      this.component.goForward();
    }

    handleReload = () => {
      this.component.reload();
    }

    handleStop = () => {
      this.component.stop();
    }

    handleDevTools = () => {
      this.component.toggleDevTools();
    }

    registerRef = (el) => {
      this.component = el;
    }
  };
};

export default withWebviewIPC;
