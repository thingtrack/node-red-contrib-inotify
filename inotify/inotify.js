module.exports = function(RED) {
    var Inotify = require('inotify').Inotify;

    var watchers = []; // global watcher list

    function getWatcherByPath(path) {
        var rlt = undefined;

        watchers.forEach(function(watcher) {
            if (watcher.path == path)
                rlt = watcher;
        });

        return rlt;
    }

    function cleanWatchers() {
        var index = 0;
        watchers.forEach(function(watcher) {
            var exist = false;

            // search watcher node after deploy
            RED.nodes.eachNode(function(node) {
                if (node.type == "inotify" && watcher.id == node.id)
                    exist = true;
            });

            // if not exist stop watcher and remove it from collection
            if (exist ==  false) {
                watcher.inotify.removeWatch(watcher.descriptor);

                watchers.splice(index, 1);
            }

            index = index + 1;
        });
    }

    function INotify(config) {
        // create node
        RED.nodes.createNode(this, config);

        // configure node
        this.folder = config.folder;

        if (config.persistent == undefined) //persistent by default, new Inotify(false) //no persistent
            this.persistent = true;
        this
            this.persistent = config.persistent;

        // create watcher manager per node and bind with node (node would be used on the watcher callback)
        this.inotify = new Inotify(this.persistent);
        this.inotify.node = this;

        // start node
        this.startListening();
    }

    RED.nodes.registerType("inotify", INotify);

    INotify.prototype.callback = function(event) {
        var type = event.mask & Inotify.IN_ISDIR ? 'directory' : 'file';

        var payload = {
            type: type,
            event: event
        };

        this.node.send({payload: payload});
    };

    INotify.prototype.startListening = function() {
        // not listen for undefined path watcher configuration
        if (this.folder == undefined)
            return;

        // start new watcher if not not exist. Only add one watcher per path. Listen to all file system events from open to close
        if(getWatcherByPath(this.folder) == undefined) {
            this.watch_descriptor = this.inotify.addWatch({path: this.folder,
                                                     watch_for: Inotify.IN_OPEN | Inotify.IN_CLOSE,
                                                     callback:  this.callback
                                                    });

            // add active watcher to collection
            watchers.push({id: this.id,
                           path: this.folder,
                           descriptor: this.watch_descriptor,
                           inotify: this.inotify});
        }
        else {
            // remove old watchers removed from node-red
            cleanWatchers();
        }
    }
};
