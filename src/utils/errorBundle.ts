const ErrorBundle: { [key: string]: string } = {
    VEHICLE_NOT_FOUND: 'Vozidlo sa nenašlo',
    VEHICLE_ALREADY_EXISTS: 'Rovnaké vozidlo už existuje',
    CUSTOMER_NOT_FOUND: 'Zákazník sa nenašiel',
    REPAIR_LOG_NOT_FOUND: 'Záznam opravy sa nenašiel',
    REPAIR_LOG_ALREADY_EXISTS: 'Záznam opravy pre toto vozidlo v rovnakom dátume už existuje',
    ATTACHMENT_NOT_FOUND: 'Príloha sa nenašla',
    UNAUTHORIZED: 'Nemáte prístup, skúste sa znova prihlásiť',
    FORBIDDEN: 'Nemáte prístup, skúste sa znova prihlásiť',
    UNEXPECTED_ERROR: 'Neznáma chyba',
    VALIDATION_ERROR: 'Nesprávne vyplnené dáta'
};

export const getLocalizedErrorMessage = (any: string): string => {
    return ErrorBundle[any] ?? any;
};
