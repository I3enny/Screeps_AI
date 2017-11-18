class Utils {
    static remove(array, elt) {
        let index = array.indexOf(elt);
        if (index > -1) {
            array.splice(index, 1);
        }
    }
}

module.exports = Utils;