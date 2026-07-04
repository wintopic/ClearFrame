<p align="center">
  <img src="icon.png" width="96" alt="ClearFrame icon">
</p>

<h1 align="center">透界 ClearFrame</h1>

<p align="center">
  A quiet GNOME utility for Dock, top bar, and window transparency.
  <br>
  为 GNOME 桌面提供 Dock、顶栏和窗口透明度控制。
</p>

<p align="center">
  <a href="https://github.com/wintopic/ClearFrame/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/wintopic/ClearFrame?label=release&color=ff5b1f"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/github/license/wintopic/ClearFrame?color=2ec27e"></a>
  <img alt="GNOME Shell" src="https://img.shields.io/badge/GNOME%20Shell-50-3584e4">
  <img alt="GTK/libadwaita" src="https://img.shields.io/badge/GTK-libadwaita-9141ac">
</p>

<p align="center">
  <img src="assets/readme-preview.svg" alt="ClearFrame preview">
</p>

## Highlights

- Control Dock transparency through Ubuntu Dock / Dash to Dock settings.
- Make the GNOME top bar transparent with the bundled Shell extension.
- Optionally apply whole-window transparency to normal application windows.
- Use a compact GTK/libadwaita interface with language, About, and update controls.
- Check and download GitHub Releases through the system proxy when GNOME proxy settings are enabled.
- Show action dialogs only when user attention is needed, such as when GNOME Shell must recognize the extension after login.

## 安装

```bash
git clone https://github.com/wintopic/ClearFrame.git
cd ClearFrame
./clearframe install
```

安装后可以从应用启动器打开 **透界**，也可以直接运行：

```bash
./clearframe gui
```

首次安装 Shell 扩展后，如果顶栏或窗口透明暂时没有生效，请注销并重新登录一次。

## Commands

```bash
./clearframe gui         # Open the settings window
./clearframe install     # Install or refresh app files and Shell extension
./clearframe on          # Enable Dock and top bar transparency
./clearframe off         # Disable transparency effects
./clearframe status      # Print current transparency state
./clearframe window-on   # Enable whole-window transparency
./clearframe window-off  # Disable whole-window transparency
```

## Updates

The app checks the latest GitHub Release:

https://github.com/wintopic/ClearFrame/releases/latest

Downloads are saved to `~/Downloads`. When a system proxy is configured in GNOME Settings, ClearFrame uses it for update checks and downloads.

## Project Layout

```text
clearframe                 Main Python GTK/libadwaita app and CLI
extension/                 Bundled GNOME Shell extension
extension/schemas/         GSettings schema for transparency options
icons/                     Local SVG icon set used by the app UI
```

## License

MIT
