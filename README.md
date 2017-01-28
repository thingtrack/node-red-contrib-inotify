# node-red-contrib-inotify
Inotify can be used to monitor individual files, or to monitor directories. When a directory is monitored, inotify will return events for the directory itself, and for files inside the directory. (ref: [GNU/Linux Manual](http://www.kernel.org/doc/man-pages/online/pages/man7/inotify.7.html))

By default it's in persistent mode. You can specify false to use the non persistent mode.

The events send will contain the following fields in **payload**: ```type``` and ```event```

### Message payload object structure is:
```javascript
msg.payload: {
    type: Resource type watched (file or directory)
    event: { watch: Watch descriptor,
             mask: Mask of events,
             cookie: Cookie that permits to associate events,
             name: Optional name of the object being watched
    }
}
```

The `event.name` property is only present when an event is returned for a file inside a watched directory; it identifies the file path name relative to the watched director 

## Inotify Events

### Watch for:
 * **Inotify.IN_ACCESS:** File was accessed (read)
 * **Inotify.IN_ATTRIB:** Metadata changed, e.g., permissions, timestamps, extended attributes, link count (since Linux 2.6.25), UID, GID, etc.
 * **Inotify.IN_CLOSE_WRITE:** File opened for writing was closed
 * **Inotify.IN_CLOSE_NOWRITE:** File not opened for writing was closed
 * **Inotify.IN_CREATE:** File/directory created in the watched directory
 * **Inotify.IN_DELETE:** File/directory deleted from the watched directory
 * **Inotify.IN_DELETE_SELF:** Watched file/directory was deleted
 * **Inotify.IN_MODIFY:** File was modified
 * **Inotify.IN_MOVE_SELF:** Watched file/directory was moved
 * **Inotify.IN_MOVED_FROM:** File moved out of the watched directory
 * **Inotify.IN_MOVED_TO:** File moved into watched directory
 * **Inotify.IN_OPEN:** File was opened
 * **Inotify.IN_ALL_EVENTS:** Watch for all kind of events
 * **Inotify.IN_CLOSE:**  (IN_CLOSE_WRITE | IN_CLOSE_NOWRITE)  Close
 * **Inotify.IN_MOVE:**  (IN_MOVED_FROM | IN_MOVED_TO)  Moves

### Additional Flags:
 * **Inotify.IN_ONLYDIR:** Only watch the path if it is a directory.
 * **Inotify.IN_DONT_FOLLOW:** Do not follow symbolics links
 * **Inotify.IN_ONESHOT:** Only send events once
 * **Inotify.IN_MASK_ADD:** Add (OR) events to watch mask for this pathname if it already exists (instead of replacing the mask).

### The following bits may be set in the `event.mask` property returned in the callback
 * **Inotify.IN_IGNORED:** Watch was removed explicitly with inotify.removeWatch(watch_descriptor) or automatically (the file was deleted, or the file system was unmounted)
 * **Inotify.IN_ISDIR:** Subject of this event is a directory
 * **Inotify.IN_Q_OVERFLOW:** Event queue overflowed (wd is -1 for this event)
 * **Inotify.IN_UNMOUNT:** File system containing the watched object was unmounted
 
## Example
 Upload a file from a FTP service to a shared folder watched from inotify node-red node. The debug obtained is:
 ```shell
 8/1/2017 12:29:073d8ea7a0.d0cef8
msg.payload : Object
{ "type": "file", "event": { "watch": 1, "mask": 32, "cookie": 0, "name": "Declaracion.png" } }
28/1/2017 12:29:073d8ea7a0.d0cef8
msg.payload : Object
{ "type": "file", "event": { "watch": 1, "mask": 8, "cookie": 0, "name": "Declaracion.png" } }
28/1/2017 12:29:073d8ea7a0.d0cef8
msg.payload : Object
{ "type": "directory", "event": { "watch": 1, "mask": 1073741856, "cookie": 0 } }
28/1/2017 12:29:073d8ea7a0.d0cef8
msg.payload : Object
{ "type": "directory", "event": { "watch": 1, "mask": 1073741840, "cookie": 0 } }
28/1/2017 12:29:103d8ea7a0.d0cef8
msg.payload : Object
{ "type": "file", "event": { "watch": 1, "mask": 32, "cookie": 0, "name": "Declaracion.png" } }
28/1/2017 12:29:103d8ea7a0.d0cef8
msg.payload : Object
{ "type": "file", "event": { "watch": 1, "mask": 16, "cookie": 0, "name": "Declaracion.png" } }
 ```

## Capture
![inotify](https://cloud.githubusercontent.com/assets/1216181/22396401/29dfb786-e559-11e6-85d1-1caee82d3490.png)

## Thanks
Thanks to c4milo for this great node package [inotify](https://www.npmjs.com/package/inotify)
