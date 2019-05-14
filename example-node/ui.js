export default {
  category: 'example',
  color: '#F5FFFA',
  defaults: {
    name: { value: '' },
  },
  inputs: 1,
  outputs: 1,
  icon: require("./function.png"),
  label: function () {
    return this.name || "example node";
  },
  paletteLabel: "example node",
};

/*
 oneditprepare is called immediately before the dialog is displayed.
 oneditsave is called when the edit dialog is okayed.
 oneditcancel is called when the edit dialog is cancelled.
 oneditdelete is called when the delete button in a configuration node’s edit dialog is pressed.
 oneditresize is called when the edit dialog is resized.
 * */