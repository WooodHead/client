import { app, shell, webContents, Menu } from 'electron';
import { find } from 'lodash';

const isMac = process.platform === 'darwin';

function bindAppMenu(browserWindow) {
  const template = [
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Stop',
          accelerator: isMac ? 'Cmd+.' : 'Esc',
          click() { browserWindow.webContents.send('view:stop'); }
        },
        {
          label: 'Reload',
          accelorator: 'CmdOrCtrl+R',
          click() { browserWindow.webContents.send('view:reload'); }
        },
        // { type: 'separator' },
        // { role: 'togglefullscreen' },
        // { role: 'resetzoom' },
        // { role: 'zoomin' },
        // { role: 'zoomout' },
        { type: 'separator' },
        {
          label: 'Toggle Developer Tools',
          accelerator: isMac ? 'Alt+Command+I' : 'Ctrl+Shift+I',
          click() { browserWindow.webContents.send('view:devtools'); }
        }
      ]
    },
    {
      label: 'History',
      submenu: [
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+[',
          click() { browserWindow.webContents.send('history:back'); }
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+]',
          click(_item, _focusedWindow) {
            console.log('all:', webContents.getAllWebContents());
            // console.log('item:', item);
            // console.log('focusedWindow:', focusedWindow);
            // console.log('all:', focusedWindow.webContents.getAllWebContents());
            browserWindow.webContents.send('history:forward');
          }
        }
      ]
    },
    {
      role: 'window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click() { shell.openExternal('https://nos.io'); }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    // nOS menu
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });

    // Edit menu
    find(template, { label: 'Edit' }).submenu.push(
      { type: 'separator' },
      {
        label: 'Speech',
        submenu: [
          { role: 'startspeaking' },
          { role: 'stopspeaking' }
        ]
      }
    );

    // Window menu
    find(template, { role: 'window' }).submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ];
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function bindContextMenu(browserWindow) {
  browserWindow.webContents.on('context-menu', (event, params) => {
    const template = [];
    const { isEditable, editFlags } = params;

    if (isEditable) {
      template.push({
        label: 'Undo',
        role: editFlags.canUndo ? 'undo' : '',
        enabled: editFlags.canUndo
      }, {
        label: 'Redo',
        role: editFlags.canRedo ? 'redo' : '',
        enabled: editFlags.canRedo
      }, {
        type: 'separator'
      }, {
        label: 'Cut',
        role: editFlags.canCut ? 'cut' : '',
        enabled: editFlags.canCut
      }, {
        label: 'Copy',
        role: editFlags.canCopy ? 'copy' : '',
        enabled: editFlags.canCopy
      }, {
        label: 'Paste',
        role: editFlags.canPaste ? 'paste' : '',
        enabled: editFlags.canPaste
      }, {
        label: 'Paste and Match Style',
        role: editFlags.canPaste ? 'pasteandmatchstyle' : '',
        enabled: editFlags.canPaste
      }, {
        label: 'Select All',
        role: editFlags.canSelectAll ? 'selectall' : '',
        enabled: editFlags.canSelectAll
      });
    }

    if (template.length === 0) {
      return;
    }

    const menu = Menu.buildFromTemplate(template);
    menu.popup(browserWindow);
  });
}

export default function bindMenus(browserWindow) {
  bindAppMenu(browserWindow);
  bindContextMenu(browserWindow);
}
