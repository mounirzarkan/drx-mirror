import {convertGeoFormatToRegex} from "../utils/_helpers/regex"

describe("convert postcode", () => {

    test('single', () => {
        var geoFormat = ["####"];
        var output = convertGeoFormatToRegex(geoFormat);
        expect(output[0]).toBe("^\\d{4}$");

    });


    test('single', () => {
        var geoFormat = ["#####-####|####|@#@ #@#|@@@ @@@@|@# #@@|@## #@@|@@# #@@|@@## #@@|@#@ #@@|@@#@ #@@"];
        var output = convertGeoFormatToRegex(geoFormat);
        
        //#####-####
        expect(output[0]).toBe("^(\\d{5}(-)?(\\d{4})?)$");
        
        //####
        expect(output[1]).toBe("^\\d{4}$");
        
        //@#@ #@#
        expect(output[2]).toBe("^[A-Z]{1}\\d{1}[A-Z]{1} \\d{1}[A-Z]{1}\\d{1}$");
        
        //@@@ @@@@
        expect(output[3]).toBe("^[A-Z]{3} [A-Z]{4}$");
        
        //@# #@@ 
        expect(output[4]).toBe("^[A-Z]{1}\\d{1} \\d{1}[A-Z]{2}$");
        
        //@## #@@
        expect(output[5]).toBe("^[A-Z]{1}\\d{2} \\d{1}[A-Z]{2}$");
        
        //@@# #@@
        expect(output[6]).toBe("^[A-Z]{2}\\d{1} \\d{1}[A-Z]{2}$");
        
        //@@## #@@
        expect(output[7]).toBe("^[A-Z]{2}\\d{2} \\d{1}[A-Z]{2}$");

        //@#@ #@@
        expect(output[8]).toBe("^[A-Z]{1}\\d{1}[A-Z]{1} \\d{1}[A-Z]{2}$");
      
        //@@#@ #@@
        expect(output[9]).toBe("^[A-Z]{2}\\d{1}[A-Z]{1} \\d{1}[A-Z]{2}$");


    });


});

