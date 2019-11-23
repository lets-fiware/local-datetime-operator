/*
 * local-datetime
 * https://github.com/lets-fiware/local-datetime-operator
 *
 * Copyright (c) 2019 Kazuhito Suda
 * Licensed under the MIT license.
 */

/* globals MockMP, moment */

(function () {

    "use strict";

    describe("LocalDatetime", function () {

        beforeAll(function () {
            window.MashupPlatform = new MockMP({
                type: 'operator',
                prefs: {
                    "format": "llll",
                    "custom": "YYYY-MM-DD",
                    "send_nulls": true
                },
                inputs: ['input'],
                outputs: ['output']
            });
        });

        beforeEach(function () {
            MashupPlatform.reset();
            MashupPlatform.operator.outputs.output.connect({simulate: () => {}});
        });

        it("format llll", () => {
            localDateTime("20191122T091234Z");

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', "Fri, Nov 22, 2019 6:12 PM");
        });

    });
})();
