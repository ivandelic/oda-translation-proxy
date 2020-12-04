module.exports = (() => {
    const mapping = { "Á": "A", "É": "E", "Ë": "E", "Í": "I", "Ó": "O", "Ö": "O", "Ú": "O", "Ü": "U", "á": "a", "é": "e", "ë": "e", "í": "i", "ó": "o", "ö": "o", "ú": "u", "ü": "u", "Ő": "O", "ő": "o", "Ű": "u", "ű": "u" };
    String.prototype.replaceSpecialCharacters = function() {
        var result = this;
        for (var map in mapping) {
            result = result.replace(new RegExp(map, 'g'), mapping[map])
        }
        return result;
    }
})();