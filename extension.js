/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

'use strict';

const { main: Main } = imports.ui;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const { LoadingSpinner } = Me.imports.src.loadingSpinner;

class Extension {
    constructor() {
    }

    enable() {
        this._settings = ExtensionUtils.getSettings(Me.metadata['settings-schema']);

        this._settings.connect('changed::animation-file', () => {
            this._loadingSpinner.destroy();
            this._loadingSpinner = new LoadingSpinner();
        });
        this._loadingSpinner = new LoadingSpinner();

        this._settings.connect('changed::hide-app-menu', () => this._setAppMenu());
        this._setAppMenu();
    }

    disable() {
        this._settings.run_dispose();
        this._settings = null;

        this._loadingSpinner.destroy();
        this._loadingSpinner = null;

        // Looks like g-s updates the top panel after the extensions are disabled
        // so we want to exit early here otherwise the appMenu will be shown on
        // the lockscreen while the extension is enabled...
        if (Main.sessionMode.isLocked)
            return;

        Main.panel.statusArea['appMenu'].container.show();
    }

    _setAppMenu() {
        if (this._settings.get_boolean('hide-app-menu'))
            Main.panel.statusArea['appMenu'].container.hide();
        else
            Main.panel.statusArea['appMenu'].container.show();
    }
}

function init() {
    return new Extension();
}
