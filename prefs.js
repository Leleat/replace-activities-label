'use strict';

function init() {
}

function fillPreferencesWindow(window) {
    const { Gtk } = imports.gi;
    const ExtensionUtils = imports.misc.extensionUtils;
    const Me = ExtensionUtils.getCurrentExtension();

    const settings = ExtensionUtils.getSettings(Me.metadata['settings-schema']);
    const builder = new Gtk.Builder();
    builder.add_from_file(`${Me.path}/prefs.ui`);

    window.add(builder.get_object('general'));

    _bindSwitches(settings, builder);
}

function _bindSwitches(settings, builder) {
    const { Gio } = imports.gi;
    const switches = [
        'hide-app-menu'
    ];

    switches.forEach(key => {
        const widget = builder.get_object(key.replaceAll('-', '_'));
        settings.bind(key, widget, 'active', Gio.SettingsBindFlags.DEFAULT);
    });
}
