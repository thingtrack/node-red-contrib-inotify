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
        watchers.forEach(function(watcher) {
            var exist = false;
            RED.nodes.eachNode(function(node) {
                if (node.type == "inotify" && watcher.id == node.id)
                    exist = true;
            });

            if (exist == false) {
                // stop watcher
                watcher.inotify.removeWatch(watcher.descriptor);

                // remove watcher from the collection
                watchers.remove(watcher);
            }

            /*if (RED.nodes.getNode(watcher.id) == undefined) {
                // stop watcher
                watcher.inotify.removeWatch(watcher.descriptor);

                // remove watcher from the collection
                watchers.remove(watcher);
            }*/
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

        // create node watcher manager
        this.inotify = new Inotify(this.persistent);

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

        this.send({payload: payload});
    };

    INotify.prototype.startListening = function() {
        // not listen for undefined path watcher configuration
        if (this.folder == undefined)
            return;

        // add new watcher if not not exist. Only add one watcher per path
        if(getWatcherByPath(this.folder) == undefined) {
            this.descriptor = this.inotify.addWatch({path: this.folder,
                                                     watch_for: Inotify.IN_OPEN | Inotify.IN_CLOSE,
                                                     callback:  this.callback
                                                    });

            // add active watcher to collection
            watchers.push({id: this.id,
                           path: this.folder,
                           descriptor: this.descriptor,
                           inotify: this.inotify});
        }
        else {
            // remove old watchers removed from node-red
            cleanWatchers();
        }
    }
};
