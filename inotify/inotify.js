module.exports = function(RED) {
  var Inotify = require('inotify').Inotify;

  var inotify = undefined; //persistent by default, new Inotify(false) //no persistent
  var node = undefined;
  var inotify_watch_descriptor = undefined;

  function INotify(config) {
    node = this;

    RED.nodes.createNode(this,config);

    this.folder = config.folder;

    //persistent by default, new Inotify(false) //no persistent
    if (config.persistent == undefined)
      this.persistent = true;
    else
      this.persistent = config.persistent;

    this.startListening();
  }

  RED.nodes.registerType("inotify", INotify);

  INotify.prototype.callback = function(event) {
    var type = event.mask & Inotify.IN_ISDIR ? 'directory' : 'file';

    var payload = {
      type: type,
      event: event
    };
    
    node.send({payload: payload});
  };

  INotify.prototype.startListening = function() {
    // watcher configuration
    var inotify_dir = {
      path: this.folder,
      watch_for: Inotify.IN_OPEN | Inotify.IN_CLOSE,
      callback:  this.callback
    };

    // sigleton patern
    if (inotify == undefined) {
      inotify = new Inotify(this.persistent);
      inotify_watch_descriptor = inotify.addWatch(inotify_dir);
    }
  }
}
