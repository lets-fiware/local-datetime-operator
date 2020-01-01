/*
 * local-datetime
 * https://github.com/lets-fiware/local-datetime-operator
 *
 * Copyright (c) 2019 Kazuhito Suda
 * Licensed under the MIT license.
 */

/* global moment */

(function () {

    "use strict";

    var pushEvent = function pushEvent(data) {
        if (MashupPlatform.operator.outputs.output.connected) {
            MashupPlatform.wiring.pushEvent('output', data);
        }
    }

    var getFormat = function getFormat() {
        var format = MashupPlatform.prefs.get('format');
        if (format == 'custom') {
            format = MashupPlatform.prefs.get('custom');
        }
        return format;
    };

    var localDateTime = function localDateTime(value) {
        if (value != null) {
            // https://momentjs.com/

            var locale = MashupPlatform.prefs.get('locale');
            if (locale != "") {
                moment().locale(locale);
            } else {
                moment().locale(MashupPlatform.context.get('language'));
            }

            value = moment(value).format(getFormat());
            pushEvent(value);

        } else {
            if (MashupPlatform.prefs.get('send_nulls')) {
                pushEvent(value);
            }
        }
    }

    /* TODO
     * this if is required for testing, but we have to search a cleaner way
     */
    if (window.MashupPlatform != null) {
        MashupPlatform.wiring.registerCallback('input', localDateTime);
    }

    /* test-code */
    window.localDateTime = localDateTime;
    /* end-test-code */

})();
