'use strict';

const { Gtk } = imports.gi;

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

    builder.get_object('anim_chooser_button').connect('clicked', button => {
        const dialog = new Gtk.FileChooserDialog({
            action: Gtk.FileChooserAction.OPEN,
            transient_for: button.get_root(),
            modal: true
        });
        dialog.add_button('OK', Gtk.ResponseType.OK);
        dialog.connect('response', (_, response_id) => {
            if (response_id === Gtk.ResponseType.OK) {
                try {
                    const path = dialog.get_file().get_path();
                    settings.set_string('animation-file', path)
                } catch (error) {
                    settings.set_string('animation-file', '');
                }
            }

            dialog.destroy();
        });

        dialog.show();
    });

    builder.get_object('anim_clear_button').connect('clicked', () => {
        settings.set_string('animation-file', '');
    });
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
