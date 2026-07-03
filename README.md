# ClearFrame / 透界

ClearFrame is a small GNOME utility for controlling Dock, top bar, and whole-window transparency.

透界是一个轻量 GNOME 工具，用于控制 Dock、顶栏和窗口整体透明效果。

## Features

- Dock transparency control through Dash to Dock settings.
- GNOME top bar transparency through the bundled Shell extension.
- Optional whole-window transparency for normal application windows.
- A GTK/libadwaita settings window with language, about, version, and update controls.
- GitHub Release update checks and downloads that use configured system proxy settings when available.

## Install

```bash
./clearframe install
```

Then open ClearFrame from the app launcher, or run:

```bash
./clearframe gui
```

If GNOME Shell does not recognize the extension immediately after first install, log out and back in once.

## Commands

```bash
./clearframe gui
./clearframe install
./clearframe on
./clearframe off
./clearframe status
./clearframe window-on
./clearframe window-off
```

## Updates

The app checks the latest GitHub Release at:

https://github.com/wintopic/ClearFrame/releases/latest

Downloads are saved to `~/Downloads`.

## License

MIT
