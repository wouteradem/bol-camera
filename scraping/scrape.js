/**
 * Created with JetBrains PhpStorm.
 * User: wouteradem
 * Date: 04/11/13
 * Time: 14:45
 * To change this template use File | Settings | File Templates.
 */

var request = require('request');
var cheerio = require('cheerio');

var fields = ['street', 'number', 'postalcode', 'city', 'country'];
var camera = '';

for (var i=1;i<10000;i++) {
    var url = 'https://eloket.privacycommission.be/elg/publicRegister.htm?decArchiveId=' + i;
    request(url, ( function() {
        return function(err, resp, body) {
            if (err)
                throw err;
            $ = cheerio.load(body);
            $('#div-1b fieldset').slice(0,1).each(function() {
                $(this).find('table').slice(1,2).each(function() {
                    camera = '{ "';
                    $(this).find('.user').each(function(field) {
                        if (fields[field] != 'country')
                            camera += fields[field] + '": "' + $(this).text().trim() + '", "';
                        else
                            camera += fields[field] + '": "' + $(this).text().trim() + '" }';
                    });
                });
            });
            console.log(camera);
        }
    } )(i));
}