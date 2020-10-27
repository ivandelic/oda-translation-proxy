var config = {};

config.googleTranslate = {};

config.googleTranslate.hostname = "translation.googleapis.com";
config.googleTranslate.port = 443;
config.googleTranslate.path = "/language/translate/v2?key=";
config.googleTranslate.method = "POST";

config.nonTranslatableLang = "en";

config.port = 3000;

module.exports = config;