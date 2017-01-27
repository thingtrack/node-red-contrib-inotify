# node-red-contrib-inotify
Inotify can be used to monitor individual files, or to monitor directories. When a directory is monitored, inotify will return events for the directory itself, and for files inside the directory. (ref: [GNU/Linux Manual](http://www.kernel.org/doc/man-pages/online/pages/man7/inotify.7.html))

By default it's in persistent mode. You can specify false in var inotify = new Inotify(false) to use the non persistent mode.

The events send will contain the following fields in **payload**: ```type``` and ```event```
