Keep You in the Trend
=====================

[Trendy](https://github.com/rhysd/Trendy) is a [GitHub Trending Repository](https://github.com/trending) viewer for trend-conscious people.  Trendy stays in menubar, watches the GitHub trends and notify the update to you.

![ss](resource/image/main.png)

### Features

- [x] Manage unread repositories.  Trendy remember you already checked the trending repository or not.
- [x] Current trending repositories.
- [x] All past trending repositories.
- [x] Cross platform (built on [Electron](https://github.com/atom/electron)).  For OS X, Linux and Windows.
- [x] Menu bar integrated window or isolated window.

### TODOs

- Enable to specify your favorite languages (now only for 'all languages')
- Use GitHub authentication to relax API rate limit.
- Embedded browser
- Emojis
- Hotkey

### Installation

__Note that now Trendy is heavily being developped.__

[Alpha release](https://github.com/rhysd/Trendy/releases) and [npm package](https://www.npmjs.com/package/trendy) are available.

### Usage

![dock](resource/image/dock.png)

After clicking the app icon, you could find the _graph_ icon in your menu bar.  Click it.
You can see the main menu window and 3 tabs in it.

- __New__: Unread repositories are here.  Unread count is in tab.  You can click check button to mark the repository as read.
- __Current__: Current trending repositories are here.  The order is the same as the ranking.
- __All__: All past repositories.

You can receive notification of new unread repositories by menu icon.

| Notified menu bar | Normal menu abr |
| ----------------- | --------------- |
| ![notified menubar](resource/image/notified_menubar.png) | ![normal menubar](resource/image/normal_menubar.png) |

When some unread repositories have been shown up, the application icon will be red.

### Isolated Window

Set `mode` value to `"isolated"` in `config.json` to enable isolated window.  Path to `config.json` is described in next section.
In some environment (especially Windows), menubar integration may not work.  If so, please enable isolated window mode and use it.

![isolated window screen shot](resource/image/isolated.png)

### Customization

You can customize Trendy by modifying `config.json`.

| OS      | Path                                                |
| ------- | --------------------------------------------------- |
| OS X    | `~/Library/Application\ Support/Trendy/config.json` |
| Linux   | `~/.config/Trendy/config.json`                      |
| Windows | `%APPDATA%\Trendy\config.json`                      |

### License

Distributed under [the MIT License](LICENSE.txt).

