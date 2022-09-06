class SnackBarConfig {
    static readonly DURATION = 3000;
    static readonly CLASSNAME_POSTFIX = '-snackbar';
}

class MessageTypes {
    static readonly SUCCESS = 'success';
    static readonly ERROR = 'error';
}

export class Constants {
    static readonly SNACKBAR_CONFIG = SnackBarConfig;
    static readonly MESSAGE_TYPES = MessageTypes;
}
