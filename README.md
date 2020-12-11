# Twitch Poll Overlay<img align="right" width="200" height="200" src="https://i.imgur.com/v7TevuS.png">
This is a small project to evaluate those "1" and "0" polls in Twitch streams, and display them live in the stream.

---

- [How to use](#how-to-use)
  - [1. Get the URL of the overlay](#1-get-the-url-of-the-overlay)
  - [2. Stream-Software setup](#2-stream-software-setup)
    - [a) Create a browser source:](#a-create-a-browser-source)
    - [b) Paste the copied URL at `URL`](#b-paste-the-copied-url-at-url)
    - [c) Adjust Width and Height](#c-adjust-width-and-height)
    - [d) Enter at Custom CSS:](#d-enter-at-custom-css)
    - [Done! Finally click again on "Refresh cache of current active".](#done-finally-click-again-on-refresh-cache-of-current-active)
- [Types](#types)
  - [Bar](#bar)
  - [Pie](#pie)
- [Why?](#why)

---

## How to use
The overlay can be used without further registration or installation.

### 1. Get the URL of the overlay
The overlay is currently hosted on GitHub Pages.  
So the base URL currently is: `https://darmiel.github.io/twitch-poll-overlay/`.  
The channel has to be specified as the parameter: `?channel=<your channel name>`:


-> http://darmiel.github.io/twitch-poll-overlay/index.html?channel=\<your channel here\>


There are a few more optional parameters.  
The easiest way is to use the 
[Parameter-Builder for twitch-poll-overlay](http://darmiel.github.io/twitch-poll-overlay/builder.html)

### 2. Stream-Software setup
In the following I will show the setup using [OBS](https://obsproject.com), but this should be possible with any other streaming program.

#### a) Create a browser source:
![img](assets/hiw-create-browser.png)

#### b) Paste the copied URL at `URL`
![img](assets/hiw-url-browser-source.png)

#### c) Adjust Width and Height
**⚠️ Note**: Please make sure that **only here** the size is adjusted.  
If you resize the browser source afterwards with your mouse, problems **will** occur.

#### d) Enter at Custom CSS:
```css
body { 
    background-color: rgba(0, 0, 0, 0); 
    margin: 0px auto; 
    overflow: hidden; 
}
```

#### Done! Finally click again on "Refresh cache of current active".
Your Browser source should look something like this:
![img](assets/hiw-ov-browser-source.png)

## Types
### Bar
![demo-bar](assets/demo-bar.gif)

### Pie
![demo-pie](assets/demo-pie.gif)

## Why?
I don't now.. I had this idea for a while now, and I just wanted to extend my TypeScript knowledge and experiment a bit with Webpack. Besides, it **might** be a little help for one or the other streamer / viewer 😁.