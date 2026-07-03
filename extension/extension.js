import GLib from 'gi://GLib';
import Meta from 'gi://Meta';
import {Extension} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const MAX_WINDOW_TRANSPARENCY = 0.75;
const MANAGED_WINDOW_TYPES = new Set([
    Meta.WindowType.NORMAL,
    Meta.WindowType.DIALOG,
    Meta.WindowType.MODAL_DIALOG,
]);

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function panelStyle(transparency) {
    const alpha = 1 - clamp(transparency, 0, 1);
    return [
        `background-color: rgba(0, 0, 0, ${alpha})`,
        'box-shadow: none',
        'border: 0px',
    ].join('; ');
}

function windowOpacity(transparency) {
    return Math.round((1 - clamp(transparency, 0, MAX_WINDOW_TRANSPARENCY)) * 255);
}

export default class ClearFrameExtension extends Extension {
    enable() {
        this._settings = this.getSettings();
        this._settingsSignals = [
            this._settings.connect('changed::topbar-enabled', () => this._syncTopBar()),
            this._settings.connect('changed::topbar-opacity', () => this._syncTopBar()),
            this._settings.connect('changed::window-enabled', () => this._syncWindows()),
            this._settings.connect('changed::window-opacity', () => this._syncWindows()),
        ];
        this._displaySignals = [
            global.display.connect('window-created', () => this._queueWindowSync()),
        ];
        this._topbarActive = false;
        this._previousPanelStyle = null;
        this._windowOpacities = new Map();
        this._windowSyncSource = 0;

        this._syncTopBar();
        this._syncWindows();
    }

    disable() {
        this._settingsSignals?.forEach(id => this._settings.disconnect(id));
        this._settingsSignals = [];
        this._displaySignals?.forEach(id => global.display.disconnect(id));
        this._displaySignals = [];
        if (this._windowSyncSource) {
            GLib.source_remove(this._windowSyncSource);
            this._windowSyncSource = 0;
        }
        this._restoreTopBar();
        this._restoreWindows();
        this._settings = null;
    }

    _syncTopBar() {
        if (!this._settings.get_boolean('topbar-enabled')) {
            this._restoreTopBar();
            return;
        }

        if (!this._topbarActive)
            this._previousPanelStyle = Main.panel.get_style();

        Main.panel.add_style_class_name('clearframe-topbar');
        Main.panel.set_style([
            this._previousPanelStyle || '',
            panelStyle(this._settings.get_double('topbar-opacity')),
        ].filter(Boolean).join('; '));
        this._topbarActive = true;
    }

    _restoreTopBar() {
        if (!this._topbarActive)
            return;

        Main.panel.remove_style_class_name('clearframe-topbar');
        Main.panel.set_style(this._previousPanelStyle || null);
        this._topbarActive = false;
        this._previousPanelStyle = null;
    }

    _queueWindowSync() {
        if (this._windowSyncSource)
            return;

        this._windowSyncSource = GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
            this._windowSyncSource = 0;
            this._syncWindows();
            return GLib.SOURCE_REMOVE;
        });
    }

    _syncWindows() {
        if (!this._settings.get_boolean('window-enabled')) {
            this._restoreWindows();
            return;
        }

        const opacity = windowOpacity(this._settings.get_double('window-opacity'));
        const activeActors = new Set();

        for (const actor of global.get_window_actors()) {
            const metaWindow = this._metaWindowForActor(actor);
            if (!this._shouldManageWindow(metaWindow))
                continue;

            activeActors.add(actor);
            if (!this._windowOpacities.has(actor))
                this._windowOpacities.set(actor, actor.opacity);

            actor.opacity = opacity;
        }

        for (const actor of this._windowOpacities.keys()) {
            if (!activeActors.has(actor))
                this._restoreWindow(actor);
        }
    }

    _restoreWindows() {
        for (const actor of this._windowOpacities.keys())
            this._restoreWindow(actor);
    }

    _restoreWindow(actor) {
        const opacity = this._windowOpacities.get(actor);
        this._windowOpacities.delete(actor);

        if (opacity === undefined)
            return;

        try {
            actor.opacity = opacity;
        } catch (_error) {
            // The window actor may already be gone by the time the idle sync runs.
        }
    }

    _metaWindowForActor(actor) {
        if (actor.get_meta_window)
            return actor.get_meta_window();
        return actor.meta_window ?? null;
    }

    _shouldManageWindow(metaWindow) {
        if (!metaWindow || metaWindow.is_skip_taskbar?.())
            return false;

        return MANAGED_WINDOW_TYPES.has(metaWindow.get_window_type());
    }
}
