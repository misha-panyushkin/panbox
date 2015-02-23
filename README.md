Creation and launch by default:
```
var pb = panbox(selector /*selector*/, params /*Object*/);
```
or 
```
var pb = new panbox(selector /*selector*/, params /*Object*/);
```

Any field inside `params` object could be omitted:
```
{
    width: px, // width of the panbox [default:100%].
    height: px, // height of the panbox [default:100%].
    scrollthumb: {
        class_name: String // class name for overriding default thumb styles.
    }
}
```

By default, __panbox__ creates the instance and save it inside DOM node of the target box, so there is no recreation, and the second call just got the first time created instance.

Also, __panbox__ is ready just after one line of code, it makes `.wrap()` and `.on()` methods calls by default. 

Public API:
```
.wrap() // wraps the scrollable container with panbox.
.unwrap() // return the container as it was before wrapping.

.on() // started listening for scrolling.
.off() //stopped listening for scrolling.

.scroll(position) // scrolls box at a certain position, 
                  // it could be 'top', 'bottom' or px.

.lock() // in progress..
.unlock() // in progress too..
```