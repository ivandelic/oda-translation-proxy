# oda-translation-proxy

The repository contains a proxy component for the prevention of outbound translation dor multilingual Oracle Digita Assistant skills. The proxy component operates between Oracle Digital Assistant and Google Translate service to disable outbound translation of ODA components. The best example is the CommonResponse component with translate: true. The component will translate outbound messages even if you have a resource bundle to cover a foreign language. In this case, this proxy component will reply with non-translated text giving you the option to permit outbound translations for ODA.
