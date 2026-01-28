const { expect } = require("chai");
const calc = require("../app/calculator");

describe("Calculator Tests", function () {

    // ADD
    it("add(5,2) should be 7 (PASS)", function () {
        expect(calc.add(5, 2)).to.equal(7);
    });

    it("add(5,2) should be 8 (FAIL)", function () {
        expect(calc.add(5, 2)).to.equal(8);
    });

    // SUB
    it("sub(5,2) should be 3 (PASS)", function () {
        expect(calc.sub(5, 2)).to.equal(3);
    });

    it("sub(5,2) should be 5 (FAIL)", function () {
        expect(calc.sub(5, 2)).to.equal(5);
    });

    // MUL
    it("mul(5,2) should be 10 (PASS)", function () {
        expect(calc.mul(5, 2)).to.equal(10);
    });

    it("mul(5,2) should be 12 (FAIL)", function () {
        expect(calc.mul(5, 2)).to.equal(12);
    });

    // DIV
    it("div(10,2) should be 5 (PASS)", function () {
        expect(calc.div(10, 2)).to.equal(5);
    });

    it("div(10,2) should be 2 (FAIL)", function () {
        expect(calc.div(10, 2)).to.equal(2);
    });

});
