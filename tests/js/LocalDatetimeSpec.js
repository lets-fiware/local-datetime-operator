/*
 * local-datetime
 * https://github.com/lets-fiware/local-datetime-operator
 *
 * Copyright (c) 2019-2023 Kazuhito Suda
 * Licensed under the MIT license.
 */

/* globals MashupPlatform, MockMP, beforeAll, afterAll, beforeEach */

(function () {

    'use strict';

    describe('LocalDatetime', function () {

        beforeAll(function () {
            window.MashupPlatform = new MockMP({
                type: 'operator',
                prefs: {
                    'locale': '',
                    'format': 'llll',
                    'custom': 'YYYY-MM-DD',
                    'send_nulls': true
                },
                inputs: ['input'],
                outputs: ['output']
            });
        });

        beforeEach(function () {
            MashupPlatform.reset();
            MashupPlatform.operator.outputs.output.connect({simulate: () => {}});
            var locale = '';
            window.moment = jasmine.createSpy('moment').and.callFake(function (value) {
                return {
                    locale: function (value) {locale = value;return this;},
                    format: function (format) {
                        if (locale === 'en' && format === 'llll') {
                            return 'Fri, Nov 22, 2019 6:12 PM';
                        } else if (locale === 'en' && format === 'YYYY-MM-DD') {
                            return '2019-11-22';
                        } else if (locale === 'es' && format === 'llll') {
                            return 'vie., 22 de nov. de 2019 18:12';
                        }
                        return '';
                    }
                };
            });
        });

        it('format llll', function () {
            MashupPlatform.prefs.set('locale', 'en');
            MashupPlatform.prefs.set('format', 'llll');
  
            localDateTime('20191122T091234Z');

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', 'Fri, Nov 22, 2019 6:12 PM');
        });


        it('format custom', function () {
            MashupPlatform.prefs.set('locale', 'en');
            MashupPlatform.prefs.set('format', 'custom');

            localDateTime('20191122T091234Z');


            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', '2019-11-22');
        });

        it('lang es', function () {
            MashupPlatform.prefs.set('locale', 'es');
            MashupPlatform.prefs.set('format', 'llll');

            localDateTime('20191122T091234Z');

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', 'vie., 22 de nov. de 2019 18:12');
        });

        it('null', function () {
            localDateTime(null);

            expect(MashupPlatform.wiring.pushEvent).toHaveBeenCalledWith('output', null);
        });

        it('null', function () {
            MashupPlatform.prefs.set('send_nulls', false);

            localDateTime(null);

            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        });

        it('output endoint is not connected', function () {
            MashupPlatform.operator.outputs.output.disconnect();

            localDateTime('20191122T091234Z');

            expect(MashupPlatform.wiring.pushEvent).not.toHaveBeenCalled();
        });
    });
})();
